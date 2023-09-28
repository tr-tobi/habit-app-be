var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();

var habitsSchema = require("../models/habitsSchema");
var usersSchema = require("../models/usersSchema");
var completionSchema = require("../models/habit-completion");

var Habits = mongoose.model("Habits", habitsSchema);
var Users = mongoose.model("Users", usersSchema);
var Completion = mongoose.model(
  "habit_completion",
  completionSchema,
  "habit_completion"
);

exports.getAllHabits = async (req: any, res: any) => {
  try {
    const habits = await Habits.find(); 
    if (!habits || habits.length === 0) {
      return res.status(404).json({ msg: "Habits Not Found" });
    }
    res.status(200).json({ habits });
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
};
exports.getHabit = async (req: any, res: any) => {
  const { username } = req.params;
  try {
    const habits = await Habits.find({ username });
    if (!habits || habits.length === 0) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    res.status(200).json({ habits });
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
};
exports.postHabit = async (req: any, res: any) => {
  const habit = new Habits({
    date: req.body.date,
    habit_name: req.body.habit_name,
    habit_category: req.body.habit_category,
    description: req.body.description,
    occurrence: req.body.occurrence,
    habit_id: new mongoose.Types.ObjectId(),
    username: req.body.username,
  });
  try {
    const newHabit = await habit.save();
    res.status(201).json({ habit: newHabit });
  } catch (err: any) {
    res.status(400).json({ msg: "Bad Request" });
  }
};

exports.patchHabit = async (req: any, res: any) => {
  const habitId = req.params.habit_id;

  const updatedFields = req.body;
  const existingHabit = await Habits.find({ habit_id: habitId });
  if (existingHabit.length != 0) {
    try {
      const updatedHabit = await Habits.findOneAndUpdate(
        { habit_id: habitId },
        { $set: updatedFields },
        { new: true }
      );
      res.status(201).json({ habit: updatedHabit });
    } catch (err: any) {
      res.status(400).json({ msg: "Bad Request" });
    }
  } else {
    return res.status(404).json({ msg: "Habit not found" });
  }
};

exports.deleteHabit = async (req: any, res: any) => {
  const habitId = new mongoose.Types.ObjectId(req.params.habit_id);
  const existingHabit = await Habits.find({ habit_id: habitId });

  if (existingHabit.length != 0) {
    try {
      await Habits.deleteOne({ habit_id: habitId });
      await Completion.deleteMany({ habit_id: habitId });
      res.status(204).json();
    } catch (err: any) {
      res.status(400).json({ msg: "Bad Request" });
    }
  } else {
    return res.status(404).json({ msg: "Habit not found" });
  }
};
