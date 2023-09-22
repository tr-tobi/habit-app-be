var mongoose = require("mongoose");
var usersSchema = require("../models/index");

const Users = mongoose.model("Users", usersSchema);

async function getUser(req: any, res: any, next: any) {
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
}

async function getCategories(req: any, res: any) {
  let user;
  try {
    user = await Users.find({ username: req.params.username });
    if (user.habit_categories.length === 0) {
      return res.status(404).json({ msg: "User has no categories" });
    }
  } catch (err: any) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  res.categories = user.habit_categories;
  res.status(200).send({ categories: res.categories });
}

async function postCategory(req: any, res: any) {
  try {
    const newCategory = req.body.newCategory;
    const user = await Users.find({ username: req.params.username });
    if (/^\s*$/.test(newCategory)){
      return res.status(400).json({ msg: "Please input non-empty category" });
    }
    if (user.habit_categories.includes(newCategory)) {
      return res.status(400).json({ msg: "Category already exists" });
    }
    user.habit_categories.push(newCategory);
    await user.save();
    res.json(user.habit_categories);
  } catch (err: any) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export default { getUser, getCategories, postCategory };
