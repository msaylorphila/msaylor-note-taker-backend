const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
let notes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// delete note by id
app.delete('/api/notes/:id', (req, res) => {
  let newNoteArr = [];
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id != req.params.id) {
      newNoteArr.push(notes[i])
    }
  }
  notes = newNoteArr;
  fs.writeFileSync(
    './db/db.json',
    JSON.stringify(notes, null, 4),
    (writeErr) =>
      writeErr
        ? console.error(writeErr)
        : console.info('Successfully updated notes!')
  );
  res.status(201).json(notes)
})
// get notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// get api/notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`);
  return res.json(notes);
});
// post new note to /api/notes
app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;
  const id = Math.random()
  if (title && text) {
    const newNote = {
      title,
      text,
      id
    };
    notes.push(newNote);

    // Write updated reviews back to the file
    fs.writeFileSync(
      './db/db.json',
      JSON.stringify(notes, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated notes!')
    );
    const response = {
      status: 'success',
      body: newNote
    };

    console.log(response);
    res.status(201).json(response)
  } else {
    res.status(500).json('Error in posting note.')
  }

});

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);