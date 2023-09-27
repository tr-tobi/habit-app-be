import mongoose from "mongoose";
import { Schema } from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL);

var notesSchema = new mongoose.Schema({
  note_id: { type: Schema.Types.Mixed, default: mongoose.Types.ObjectId },
  username: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

module.exports = notesSchema;
