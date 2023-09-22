var { mongoose } = require("mongoose");
var { config } = require("dotenv");

config();

var DATABASE_URL = process.env.DATABASE_URL as string;

mongoose.connect(DATABASE_URL);

var usersSchema = new mongoose.Schema({
  _id: String,
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
