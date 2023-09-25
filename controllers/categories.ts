import { Request, Response } from "express";
var mongoose = require("mongoose");
var usersSchema = require("../models/usersSchema");
var Users = mongoose.model("Users", usersSchema);

exports.getCategories = async (req: Request, res: Response) => {
  let user;
  try {
    user = await Users.findOne({ username: req.params.username });
    if (user.habit_categories.length === 0) {
      return res.status(404).json({ msg: "User has no categories" });
    }
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  res.status(200).send({ categories: user.habit_categories });
};

exports.postCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = req.body.newCategory;
    const user = await Users.findOne({ username: req.params.username });

    if (/^\s*$/.test(newCategory)) {
      return res.status(400).json({ msg: "Please input non-empty category" });
    }
    if (user.habit_categories.includes(newCategory)) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    const categories = [...user.habit_categories, newCategory];
    const update = { $set: { habit_categories: categories } };
    await Users.findOneAndUpdate({ username: req.params.username }, update);

    const updatedUser = await Users.findOne({ username: req.params.username });
    res.status(201).json(updatedUser.habit_categories);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
