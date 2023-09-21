const express = require("express");
require("dotenv").config();
var mongoose = require("mongoose");
var usersSchema = require("./models/index.ts");
const router = express.Router();
mongoose.connect(process.env.DATABASE_URL);
import getUser from "./controllers/index";

var app = express();
app.use(express.json());
app.use(router);

const db = mongoose.connection;

db.on("error", (error: any) => {
  console.error(error);
});

db.once("open", () => {
  console.log("connected to database");
});

const Users = mongoose.model("Users", usersSchema);

router.get("/api/users", async (req: any, res: any) => {
  try {
    const users = await Users.find();
    res.json({ users: users });
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
});

router.post("/api/users", async (req: any, res: any) => {
  const user = new Users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    habit_categories: [],
    challenges: [],
    habits: [],
    notes: [],
  });
  try {
    const newUser = await user.save();
    res.status(201).json({ user: newUser });
  } catch (err: any) {
    res.status(400).json({ msg: "Bad Request" });
  }
});

router.get("/api/users/:username", getUser, (req: any, res: any) => {
  //bcrypt compare to check password
  res.send({ user: res.user });
});

router.patch("/api/users/:username", getUser, async (req: any, res: any) => {
  if (req.body.password != null || req.body.password != undefined) {
    res.user[0].password = req.body.password;
    try {
      await res.user[0].save();
      res.json(res.user[0]);
    } catch (err: any) {
      res.status(500).json({ msg: "Error saving user data" });
    }
  } else {
    res.status(400).json({ msg: "No password entered" });
  }
});

router.delete("/api/users/:username", getUser, async (req: any, res: any) => {
  try {
    await Users.deleteOne({ username: res.user });
    res.json({ msg: "User Deleted" });
  } catch (err: any) {
    res.status(500).json({ msg: "Error deleting user" });
  }
});

const { PORT = 9090 } = process.env;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
