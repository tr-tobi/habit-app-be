import { Schema } from "mongoose";
var { mongoose } = require("mongoose");
const { DATABASE_URL } = require("../connection");

mongoose.connect(
  "mongodb+srv://sainab:test123@habittracker.uyfmxmb.mongodb.net/"
);

var completionSchema = new mongoose.Schema(
  {
    habit_id: {
      type: Schema.Types.Mixed,
      default: mongoose.Types.ObjectId,
    },
    date: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { collection: "habit_completion" }
);

module.exports = completionSchema;
