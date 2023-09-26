import { Schema } from "mongoose";
import mongoose from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
