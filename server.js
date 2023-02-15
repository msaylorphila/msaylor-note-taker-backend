const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT||3001;
const app = express();
let notes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.delete('/api/notes/:id', (req, res) => {
let newNoteArr = [];
for (var i = 0; i < notes.length; i ++) {
  if (notes[i].id != req.params.id){
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

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {

  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
  return res.json(notes);
});

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

    // fs.readFile('./db/db.json', 'utf8', (err, data) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
        // Convert string into JSON object
        // const parsedNotes = JSON.parse(data);
        // console.log(data)
        // // Add a new review
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
      // }
    // });
  //   const response = {
  //     status: 'success',
  //     body: newNote
  //   };
    
  // console.log(response);
  // res.status(201).json(response)
  } else {
    res.status(500).json('Error in posting note.')
  }
 
  })



// GIVEN a note-taking application
// WHEN I open the Note Taker*
// THEN I am presented with a landing page with a link to a notes page*
// WHEN I click on the link to the notes page*
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);