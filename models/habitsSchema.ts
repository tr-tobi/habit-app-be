import { Schema } from "mongoose";
var { mongoose } = require("mongoose");
const { DATABASE_URL } = require("../connection");

mongoose.connect(
  "mongodb+srv://sainab:test123@habittracker.uyfmxmb.mongodb.net/"
);

var habitsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  habit_name: {
    type: String,
    required: true,
  },
  habit_category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  occurrence: [
    {
      type: String,
      required: true,
    },
  ],
  habit_id: {
    type: Schema.Types.Mixed,
    default: mongoose.Types.ObjectId,
  },
});

module.exports = habitsSchema;
