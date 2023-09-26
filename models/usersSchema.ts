import mongoose from "mongoose";
const { DATABASE_URL } = require("../connection");

mongoose.connect(DATABASE_URL);

var usersSchema = new mongoose.Schema({
  _id: String,
  username: {
    type: String,
    required: false,
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
    required: false,
  },
  challenges: {
    type: Array,
    required: false,
  },
  habits: {
    type: Array,
    required: false,
  },
  notes: {
    type: Array,
    required: false,
  },
});

module.exports = usersSchema;
