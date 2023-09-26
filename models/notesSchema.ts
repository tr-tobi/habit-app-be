import mongoose from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL);

var notesSchema = new mongoose.Schema({
  _id: String,
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
