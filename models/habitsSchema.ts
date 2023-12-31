import { Schema } from "mongoose";
import mongoose from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL);

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
  username: {
    type: String,
    required: true,
  }
});

module.exports = habitsSchema;
