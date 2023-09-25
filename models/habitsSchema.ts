import { Schema } from "mongoose";

var { mongoose } = require("mongoose");
var { config } = require("dotenv");

config();

var DATABASE_URL = process.env.DATABASE_URL as string;

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
});

module.exports = habitsSchema;
