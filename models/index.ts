var { mongoose } = require("mongoose");
const { config } = require("dotenv");

config();

const DATABASE_URL = process.env.DATABASE_URL as string;

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

var habitsSchema = new mongoose.Schema({
  habit_categories: [],
  challenges: [],
  habits: [],
  notes: [],
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
}]
})

module.exports = usersSchema, habitsSchema;
