var { mongoose } = require("mongoose");
const { DATABASE_URL } = require("../connection");

mongoose.connect(
  "mongodb+srv://sainab:test123@habittracker.uyfmxmb.mongodb.net/"
);

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
