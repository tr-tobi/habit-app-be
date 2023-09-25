var mongoose = require("mongoose");
var usersSchema = require("../../models/usersSchema");
var completionSchema = require("../../models/habit-completion");

var Users = mongoose.model("Users", usersSchema);
var Completion = mongoose.model(
  "habit_completion",
  completionSchema,
  "habit_completion"
);

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
