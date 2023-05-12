import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql
  .createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
  })
  .promise();

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

//   Get all notes
export async function getNotes() {
  const [rows] = await connection.query("SELECT * FROM notes");
  return rows;
}

// const notes = await getNotes();
// console.log(notes);

//   Get a specific note
export async function getNote(id) {
  const [row] = await connection.query(
    "SELECT * FROM notes WHERE note_id = ?",
    [id]
  );
  return row;
}

// const note = await getNote(2);
// console.log(note);

// Create a new Note
export async function createNote(title, contents) {
  const [result] = await connection.query(
    "INSERT INTO notes (title, contents) VALUES(?, ?)",
    [title, contents]
  );
  console.log(result);
  return result.insertId;
}

// const noteInsertId = await createNote("Note 8", "This is Note 8 content.");
// console.log(noteInsertId);

// Edit a specific Note
export async function updateNote(title, contents, id) {
  const [result] = await connection.query(
    "UPDATE notes SET title=?, contents=? WHERE note_id=?",
    [title, contents, id]
  );
  return result.affectedRows;
}

// const affectedRows = await updateNote("Note 111", "", 11);
// console.log(affectedRows);

// Delete a Note
export async function deleteNote(id) {
  const [result] = await connection.query("DELETE FROM notes WHERE note_id=?", [
    id,
  ]);
  if (result.affectedRows === 1) return true;
  return false;
}

// const state = deleteNote(9);
// console.log(state)
