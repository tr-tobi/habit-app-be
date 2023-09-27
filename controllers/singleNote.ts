import { Request, Response } from "express";
var mongoose = require("mongoose");
var notesSchema = require("../models/notesSchema");
var Notes = mongoose.model("Notes", notesSchema);

exports.patchNote = async (req: Request, res: Response) => {
  const { username, note_id } = req.params;
  const { note_body } = req.body;

  if (note_body != null) {
    try {
      const updatedNote = await Notes.findOneAndUpdate(
        { note_id },
        { $set: { body: note_body } }
      );
      res.status(201).json(updatedNote);
    } catch (err: any) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ msg: "No note body provided" });
  }
};

exports.deleteNote = async (req: Request, res: Response) => {
  const { username, note_id } = req.params;
  const note = await Notes.find({ note_id: note_id });

  if (note.length != 0) {
    try {
      await Notes.deleteOne({ note_id: note_id });
      res.status(204).json();
    } catch (err: any) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  } else {
    return res.status(404).json({ msg: "Note not found" });
  }
};
