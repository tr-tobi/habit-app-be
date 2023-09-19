const { mongoose } = require("mongoose");
const { config } = require("dotenv");


config();

const DATABASE_URL = process.env.DATABASE_URL as string;

mongoose.connect(DATABASE_URL);

const usersSchema = new mongoose.Schema({
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
      }
});



module.exports = usersSchema;
