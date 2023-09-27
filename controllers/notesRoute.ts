var mongoose = require("mongoose");
var notesSchema = require("../models/notesSchema");
import { NextFunction, Request, Response } from "express";

var Notes = mongoose.model("Notes", notesSchema);

exports.getAllNotes = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const notes = await Notes.find({ username });
    res.json({ notes });
  } catch (err: any) {
    res.status(500).json({ msg: "error" });
  }
};

exports.postNote = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { username } = req.params;
  const date = new Date();
  const newDate = date.toISOString().split("T")[0];

  try {
    const note = new Notes({
      _id: new mongoose.Types.ObjectId(),
      note_id: new mongoose.Types.ObjectId(),
      username,
      date: newDate,
      body,
    });

    const newNote = await note.save();

    res.status(201).json({ newNote });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ msg: "Bad Request" });
    } else {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};
