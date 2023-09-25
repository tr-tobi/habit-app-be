var mongoose = require("mongoose");
var usersSchema = require("../models/usersSchema");
import { NextFunction, Request, Response } from "express";

var Users = mongoose.model("Users", usersSchema);

exports.getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Users.find();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ msg: "error" });
  }
};

exports.postUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    const user = new Users({
      _id: new mongoose.Types.ObjectId(),
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

exports.getUser = async (req: Request, res: Response, next: NextFunction) => {
  let user;
  try {
    user = await Users.find({ username: req.params.username });
    if (user === null || user.length === 0) {
      return res.status(404).json({ msg: "User Not Found" });
    }
  } catch (err: any) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  res.locals.user = user;

  next();
};

exports.getUserResponse = (req: Request, res: Response) => {
  res.send({ user: res.locals.user });
};

exports.postUserAuth = (req: Request, res: Response) => {
  let correct: boolean = false;

  if (
    res.locals &&
    res.locals.user &&
    Array.isArray(res.locals.user) &&
    res.locals.user.length > 0
  ) {
    if (
      req.body.password === res.locals.user[0].password &&
      req.body.username === res.locals.user[0].username
    ) {
      correct = true;
    }
  }

  res.status(201).json({ correct });
};

exports.patchUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  if (req.body.password != null || req.body.password != undefined) {
    try {
      const existingUser = await Users.findOne({ username });

      if (!existingUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      existingUser.password = req.body.password;
      await Users.updateOne(
        { username },
        { $set: { password: req.body.password } }
      );
      res.json(existingUser);
    } catch (err: any) {
      res.status(500).json({ msg: "Error saving user data" });
    }
  } else {
    res.status(400).json({ msg: "No password entered" });
  }
};

exports.deleteUser = async (req: Request, res: Response) => {
  try {
    await Users.deleteOne({ username: "res.user" });
    res.json({ msg: "User Deleted" });
  } catch (err: any) {
    res.status(500).json({ msg: "Error deleting user" });
  }
};
