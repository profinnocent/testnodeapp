import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
}).promise()

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

//   Get all notes
async function getNotes(){
    const [rows] = await connection.query("SELECT * FROM notes");
    return rows;
}

// const notes = await getNotes();
// console.log(notes)

//   Get a specific note
async function getNote(id){
    const [row] = await connection.query("SELECT * FROM notes WHERE note_id = ?", [id]);
    // console.log(row[0]);
    return row;
}

// const note = await getNote(2);
// console.log(note);


// Create a new Note
async function createNote(title, contents){
    const [result] = await connection.query("INSERT INTO notes (title, contents) VALUES(?, ?)", [title, contents]);
    return result.insertId;
}

// const noteInsertId = await createNote("Note 8", "This is Note 8 content.");
// console.log(noteInsertId);


// Edit a specific Note
async function updateNote(title, contents, id){
    // console.log('title: ', title);
    // console.log('contents: ', contents);
    // console.log('id: ', id);

    if(id === null || id === undefined){
        return "Pls enter an ID";
    }
    else{
        const note = await getNote(id);
        // console.log(note);
        if(note.length > 0){
            // console.log(note[0].title);
            // console.log(note[0].contents);
          // let sql = '';;
        const mytitle = title === '' ? note[0].title : title;  
        const mycontents = contents === '' ? note[0].contents : contents;
        // console.log('mytitle: ', mytitle);
        // console.log('mycontents: ', mycontents);
        const [result] = await connection.query("UPDATE notes SET title=?, contents=? WHERE note_id=?", [mytitle, mycontents, id]);
        return result.affectedRows;
        }
        else{
            return 'Note with this Id does not exist';
        }
    }
}

const affectedRows = await updateNote("Note 111", '', 11);
console.log(affectedRows);


// Delete a delete
async function deleteNote(id){
    const [result] = await connection.query("DELETE FROM notes WHERE note_id=?", [id]);
    // console.log(result.affectedRows);
    if(result.affectedRows == 0) console.log("false");
    console.log("true");
}

// const state = deleteNote(9);
// console.log(state)