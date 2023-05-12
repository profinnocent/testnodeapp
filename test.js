import express from "express";
import dotenv from "dotenv";
dotenv.config();

// Import mysql crud functions
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "./dbpool.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!!!");
});

// Get all notes
app.get("/notes", async (req, res) => {
  const notes = await getNotes();
  if (notes.length > 0) {
    res.status(200).send({ result: notes, resultCode: 1 });
  } else {
    res.status(400).send({ result: "No notes found", resultCode: 0 });
  }
});

// Get a single note
app.get("/notes/:id", async (req, res) => {
  const note = await getNote(req.params.id);
  if (note.length == 1) {
    res.status(200).send({ result: note[0], resultCode: 1 });
  } else if (note.length > 1) {
    res
      .status(400)
      .send({ result: "Identical notes, pls check", resultCode: 2 });
  } else {
    res.status(400).send({ result: "No notes found", resultCode: 0 });
  }
});

// Create a new note
app.post("/notes", async (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;
  const noteInsertId = await createNote(title, contents);
  console.log(noteInsertId);
  if (typeof noteInsertId === "number") {
    res.status(200).send({
      result: "Note inserted successfully",
      noteInsertId: noteInsertId,
      resultCode: 1,
    });
  } else {
    res
      .status(400)
      .send({ result: "Note not created. Try again", resultCode: 0 });
  }
});

// Update a note
app.put("/notes/:id", async (req, res) => {
  const id = req.params.id;

  if (id === undefined || id === null || isNaN(id)) {
    res
      .status(400)
      .send({ result: "Please provide a valid Note ID", resultCode: 0 });
  } else {
    const note = await getNote(id);
    if (note.length === 1) {
      // console.log(note);
      const title =
        req.body.title === undefined || req.body.title === null
          ? note[0].title
          : req.body.title;
      const contents =
        req.body.contents === undefined || req.body.contents === null
          ? note[0].contents
          : req.body.contents;

      const result = await updateNote(title, contents, id);
      // console.log(result);

      if (result > 0) {
        res.status(200).send({
          result: "Note updated successfully",
          resultCode: 1,
        });
      } else {
        res.status(400).send({
          result: "Note NOT updated. Try again",
          resultCode: 0,
        });
      }
    } else {
      res.status(400).send({
        result: "Note with this ID does not exist",
        resultCode: 0,
      });
    }
  }
});

// Delete a single Note (DELETE)
app.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;

  if (id === undefined || id === null || isNaN(id)) {
    res
      .status(400)
      .send({ result: "Please provide a valid Note ID", resultCode: 0 });
  } else {
    const note = await getNote(id);
    if (note.length === 1) {
      const result = await deleteNote(id);
      if (result) {
        res.status(200).send({
          result: "Note deleted successfully",
          resultCode: 1,
        });
      } else {
        res.status(400).send({
          result: "Note NOT deleted. Try again",
          resultCode: 0,
        });
      }
    } else {
      res.status(400).send({
        result: "Note with this ID does not exist",
        resultCode: 0,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log("Example app listening on port:" + PORT);
});
