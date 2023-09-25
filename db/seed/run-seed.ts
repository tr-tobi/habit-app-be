var mongoose = require("mongoose");
var usersSchema = require("../../models/usersSchema");
var completionSchema = require("../../models/habit-completion");
var habitsSchema = require("../../models/habitsSchema");

var Users = mongoose.model("Users", usersSchema);
var Completion = mongoose.model(
  "habit_completion",
  completionSchema,
  "habit_completion"
);
var Habits = mongoose.model("Habits", habitsSchema);

exports.insertUsers = async (usersData: any) => {
  try {
    await Users.insertMany(usersData);
  } catch (error) {
    console.error("Error inserting users:", error);
  }
};

exports.insertCompletion = async (completionData: any) => {
  try {
    await Completion.insertMany(completionData);
  } catch (error) {
    console.error("Error inserting users:", error);
  }
};

exports.insertHabits = async (habitsData: any) => {
  try {
    await Habits.insertMany(habitsData);
  } catch (error) {
    console.error("Error inserting users:", error);
  }
};
