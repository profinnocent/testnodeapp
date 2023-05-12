import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Get all records from notes table
function getNotes() {
  connection.query("SELECT * FROM notes", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
}

// getNotes();
// const notes = getNotes();
// console.log(notes);
// const resArr = [];
// resArr['result'] = getNotes();
// console.log(resArr);

// Get a single record from notes table
function getNote(id) {
  connection.query(
    "SELECT * FROM notes WHERE note_id=?",
    [id],
    function (err, result) {
      if (err) throw err;
      console.log(result);
    }
  );
}

// console.log(getNote(1));
// getNote(1);

// Insert or Create a new record in notes table
function createNotes(mytitle, mycontent) {
  connection.query(
    "INSERT INTO notes (title, contents) VALUES(?, ?)",
    [mytitle, mycontent],
    function (err, result) {
      if (err) throw err;
      console.log(result.insertId);
    }
  );
}

createNotes("Note 12", "This is note 12 content");

// Edit or Update a record in notes table
function updateNote(mytitle, mycontent, myid) {
  // Check if record exist
  // const note = getNote(myid);
  // console.log(note);
  // if (note){
  connection.query(
    "UPDATE notes SET title=?, contents=? WHERE note_id=?",
    [mytitle, mycontent, myid],
    function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    }
  );
  // }
  // else{
  //   console.log("Note does not exist");
  // }
}

// updateNote("Note 22", "This is note 22 content", 2);
// getNote(2);

// Delete a record in notes table
function deleteNote(myid) {
  // Check if record exist
  // const note = getNote(myid);
  // console.log(note);
  // if (note){
  connection.query(
    "DELETE FROM notes WHERE note_id=?",
    [myid],
    function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record deleted");
    }
  );
  // }
  // else{
  //   console.log("Note does not exist");
  // }
}

// deleteNote(3);
// getNotes();
