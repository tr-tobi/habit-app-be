import { log } from "console";

var mongoose = require("mongoose");
var usersSchema = require("../models/usersSchema");

const Users = mongoose.model("Users", usersSchema);

async function getCategories(req: any, res: any) {
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
  res.categories = user.habit_categories;
  res.status(200).send({ categories: res.categories });
}

async function postCategory(req: any, res: any) {
  try {
    const newCategory = req.body.newCategory;
    console.log(newCategory, "controller");
    
    const user = await Users.findOne({ username: req.params.username });
    if (/^\s*$/.test(newCategory)) {
      return res.status(400).json({ msg: "Please input non-empty category" });
    }
    if (user.habit_categories.includes(newCategory)) {
      return res.status(400).json({ msg: "Category already exists" });
    }
    user.habit_categories.push(newCategory);
    await user.save();
    res.status(201).json(user.habit_categories);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = { getCategories, postCategory };
