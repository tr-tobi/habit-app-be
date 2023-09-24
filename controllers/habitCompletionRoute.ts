var mongoose = require("mongoose");
var completionSchema = require("../models/habit-completion");
import { NextFunction, Request, Response } from "express";

var Completion = mongoose.model(
  "habit_completion",
  completionSchema,
  "habit_completion"
);
exports.getCompletionByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, date } = req.params;

  try {
    const completions = await Completion.find({
      username,
      date,
    });
    if (completions.length === 0) {
      return res
        .status(404)
        .json({ msg: "No completions found for this user and date" });
    }

    res.locals.completions = completions;
    next();
  } catch (err: any) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.completionRes = (req: Request, res: Response) => {
  res.send({ habit_completion: res.locals.completions });
};

exports.postCompletion = async (req: Request, res: Response) => {
  const date = new Date();
  const newDate = date.toISOString().split("T")[0];
  const { username, completed, habit_id } = req.body;

  const habitId = new mongoose.Types.ObjectId();

  try {
    const habit = new Completion({
      date: newDate,
      completed,
      username,
      habit_id,
    });

    const newHabit = await habit.save();
    newHabit.habit_id = habitId;

    res.status(201).json({ habit: newHabit });
  } catch (err: any) {
    res.status(400).json({ msg: "Bad Request" });
  }
};

exports.patchCompletion = async (req: Request, res: Response) => {
  const { completed, habit_id } = req.body;

  if (completed != null || completed != undefined) {
    try {
      const updatedCompletion = await Completion.findOneAndUpdate(
        { habit_id },
        { $set: { completed } },
        { new: true }
      );

      res.json(updatedCompletion);
    } catch (err: any) {
      res.status(500).json({ msg: "Error updating completion" });
    }
  } else {
    res.status(400).json({ msg: "No 'completed' value provided" });
  }
};
