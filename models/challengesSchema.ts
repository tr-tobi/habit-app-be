import mongoose from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL);

var challengesSchema = new mongoose.Schema({
  challenge_name: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  pass_requirement: {
    type: Number,
    required: true,
  },
  habits_tracked: {
    type: Array,
    required: true,
  },
});

module.exports = challengesSchema;
