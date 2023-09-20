const express = require("express");
require("dotenv").config();
var mongoose = require("mongoose");
var usersSchema = require("./models/index.ts");
const router = express.Router();
mongoose.connect(process.env.DATABASE_URL);

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

const { PORT = 9090 } = process.env;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
