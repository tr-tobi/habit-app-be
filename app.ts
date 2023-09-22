const express = require("express");
require("dotenv").config();
var mongoose = require("mongoose");
var usersSchema = require("./models/index.ts");
const router = express.Router();
mongoose.connect(process.env.DATABASE_URL);
import getUser from "./controllers/index";
import getCategories from "./controllers/index";
import postCategory from "./controllers/index";
const bcrypt = require("bcrypt");

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

const saltRounds = 10;

router.post("/api/users", async (req: any, res: any) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new Users({
      username,
      email,
      password: hashedPassword,
      habit_categories: [],
      challenges: [],
      habits: [],
      notes: [],
    });

    const newUser = await user.save();
    res.status(201).json({ user: newUser });
  } catch (err: any) {
    res.status(400).json({ msg: "Bad Request" });
  }
});

router.get("/api/users/:username", getUser, (req: any, res: any) => {
  res.send({ user: res.user });
});

router.patch("/api/users/:username", getUser, async (req: any, res: any) => {
  if (req.body.password != null || req.body.password != undefined) {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    res.user[0].password = hashedPassword;
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

router.get("/api/categories/:username", getCategories);

router.post("/api/categories/:username", postCategory);

const { PORT = 9090 } = process.env;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
