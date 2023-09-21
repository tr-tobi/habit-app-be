var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();

var habitsSchema = require("../models/habitsSchema");

const Habits = mongoose.model("Habits", habitsSchema);

exports.getAllHabits = async (req: any, res: any) => {
        try {  
          const habits = await Habits.find();
          res.json({ habits: habits });
        } catch (err) {
          res.status(500).json({ msg: "error" });
        }
      }

exports.postHabit = async (req: any, res: any) => {
        const habit = new Habits({
          date: req.body.date,
          habit_name: req.body.habit_name,
          habit_category: req.body.habit_category,
          description: req.body.description,
          occurrence: req.body.occurrence,
        });
        try {
          const newHabit = await habit.save();
          res.status(201).json({ habit: newHabit });
        } catch (err: any) {
          res.status(400).json({ msg: "Bad Request" });
        }
      }

  