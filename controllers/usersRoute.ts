var mongoose = require("mongoose");
var usersSchema = require("../models/index");

var Users = mongoose.model("Users", usersSchema);

exports.getAllUsers = async (req: any, res: any) => {
  try {
    const users = await Users.find();
    res.json({ users: users });
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
};

exports.postUser = async (req: any, res: any) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    const user = new Users({
      username,
      email,
      password: password,
      habit_categories: [],
      challenges: [],
      habits: [],
      notes: [],
    });

    const newUser = await user.save();
    const returnObj = {
      username,
      habit_categories: [],
      challenges: [],
      habits: [],
      notes: [],
    };
    res.status(201).json({ user: returnObj });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ msg: "Bad Request" });
    } else {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};

exports.getUser = async (req: any, res: any, next: any) => {
  let user;
  try {
    user = await Users.find({ username: req.params.username });
    if (user === null || user.length === 0) {
      return res.status(404).json({ msg: "User Not Found" });
    }
  } catch (err: any) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  res.user = user;

  next();
};

exports.getUserResponse = (req: any, res: any) => {
  res.send({ user: res.user });
};

exports.postUserAuth = (req: any, res: any) => {
  let correct: Boolean = false;
  if (
    req.body.password === res.user[0].password &&
    req.body.username === res.user[0].username
  ) {
    correct = true;
  } else {
    correct = false;
  }

  res.status(201).json({ correct });
};

exports.patchUser = async (req: any, res: any) => {
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
};

exports.deleteUser = async (req: any, res: any) => {
  try {
    await Users.deleteOne({ username: "res.user" });
    res.json({ msg: "User Deleted" });
  } catch (err: any) {
    res.status(500).json({ msg: "Error deleting user" });
  }
};
