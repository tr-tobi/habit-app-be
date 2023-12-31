var express = require("express");
require("dotenv").config();
import mongoose from "mongoose";
var router = express.Router();
const { getAllHabits, getHabit, postHabit, patchHabit, deleteHabit } = require("./controllers/habitsRoute");

const { getAllNotes, postNote } = require("./controllers/notesRoute");
const { DATABASE_URL } = require("./connection");

mongoose.connect(DATABASE_URL);
const {
  getCompletionByDate,
  completionRes,
  postCompletion,
  patchCompletion,
} = require("./controllers/habitCompletionRoute");

const { getCategories, postCategory } = require("./controllers/categories");
const { patchNote, deleteNote } = require("./controllers/singleNote");
const {
  getUser,
  getAllUsers,
  postUser,
  getUserResponse,
  postUserAuth,
  patchUser,
  deleteUser,
} = require("./controllers/usersRoute");

const {
  getChallenges,
  postChallenge,
  getChallenge,
  deleteChallenge,
} = require("./controllers/challengesRoute");
var completionSchema = require("./models/habit-completion");
var endpoints = require("./endpoints.json");
const cors = require("cors");

var app = express();
app.use(cors());

app.use(express.json());
app.use(router);

const db = mongoose.connection;

db.on("error", (error: any) => {
  console.error(error);
});

db.once("open", () => {
  console.log("connected to database");
});

router.get("/api", (req: Request, res: any) => {
  try {
    res.send(endpoints);
  } catch (err: any) {
    res.status(500).json({ msg: "error" });
  }
});

router.get("/api/users", getAllUsers);

router.post("/api/users", postUser);

router.get("/api/users/:username", getUser, getUserResponse);

router.post("/api/auth/:username", getUser, postUserAuth);

router.patch("/api/users/:username", getUser, patchUser);

router.delete("/api/users/:username", getUser, deleteUser);

router.get(
  "/api/users/:username/habit_completion/:date",
  getCompletionByDate,
  completionRes
);

router.post("/api/users/:username/habit_completion", getUser, postCompletion);

router.patch("/api/users/:username/habit_completion", getUser, patchCompletion);

router.get("/api/categories/:username", getCategories);

router.post("/api/categories/:username", postCategory);

router.get("/api/habits/users", getAllHabits);

router.get("/api/habits/:username", getHabit);

router.post("/api/users/:username/habits", postHabit);

router.patch("/api/users/:username/habits/:habit_id", patchHabit);

router.delete("/api/users/:username/habits/:habit_id", deleteHabit);

router.get("/api/users/:username/notes", getUser, getAllNotes);

router.post("/api/users/:username/notes", getUser, postNote);

router.get("/api/users/:username/challenges", getUser, getChallenges);

router.post("/api/users/:username/challenges", getUser, postChallenge);

router.patch("/api/users/:username/notes/:note_id", patchNote);

router.delete("/api/users/:username/notes/:note_id", deleteNote);

router.get("/api/users/:username/challenges/:challenge_id", getChallenge);

router.delete("/api/users/:username/challenges/:challenge_id", deleteChallenge);

const { PORT = 10000 } = process.env;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
