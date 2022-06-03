const fs = require('fs');
const path = require('path');

const notesJson = require('./db/db.json');

const express = require('express');
const { json } = require('express/lib/response');
const { Server } = require('http');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    res.json(notesJson.slice(1))
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.get('/notes/:title', (req, res) => {
    const requestedTitle = req.params.title.toLowerCase();
    if (requestedTitle) {
        for (let i = 0; i < notesJson.length; i++) {
            if (requestedTitle === notesJson[i].title.toLocaleLowerCase()) {
                console.log(requestedTitle)
                return res.json(requestedTitle)
            }
        }
    }
})


const createNewNote = (body, arr) => {
    const newNote = body;
    if (!Array.isArray(arr)) {
        arr = [];
    } else if (arr.length === 0) {
        arr.push(0)
    }

    function randomIdGenerator () {
        return Math.floor((1 + Math.random()) * 0x10000)
    }

    body.id = randomIdGenerator();
    console.log(body.id)

    arr.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(arr, null, 3));

    return newNote;
};

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, notesJson)
    res.json(newNote)
});

// const deleteNote = (title, arr) => {
//     for (let i = 0; arr.length; i++) {
//         let currentIndex = arr[i]

//         if (currentIndex.title === title) {
//             arr.splice(i);
//             fs.writeFileSync(
//                 path.join(__dirname, './db/db.json'),
//                 JSON.stringify(arr, null, '')
//             );

//             break;
//         }
//     }
// }

const deleteNote = (arr, id) => {
    for (let i = 0; i < arr.length; i++) {
        let currentIndex = arr[i];

        if (currentIndex.id == id) {
            arr.splice(i, 1);
            console.log(arr)
            fs.writeFileSync(path.join(__dirname, './db/db.json'),
                JSON.stringify(arr, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(notesJson, req.params.id);
    res.json(true);
});


app.listen(PORT, () => {
    console.log(`API server live on port ${PORT}`)
});