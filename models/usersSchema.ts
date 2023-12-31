import mongoose from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL);

var usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  habit_categories: {
    type: Array,
    required: true,
  },
  challenges: {
    type: Array,
    required: true,
  },
  habits: {
    type: Array,
    required: true,
  },
  notes: {
    type: Array,
    required: true,
  },
});

module.exports = usersSchema;
