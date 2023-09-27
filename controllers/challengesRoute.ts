var mongoose = require("mongoose");
var challengesSchema = require("../models/challengesSchema");
import { NextFunction, Request, Response } from "express";

var Challenges = mongoose.model("challenges", challengesSchema);

exports.getChallenges = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const challenges = await Challenges.find({ username });
    res.json({ challenges });
  } catch (err: any) {
    res.status(500).json({ msg: "error" });
  }
};

exports.postChallenge = async (req: Request, res: Response) => {
  const {
    challenge_name,
    start_date,
    end_date,
    description,
    pass_requirement,
    habits_tracked,
  } = req.body;
  const { username } = req.params;

  try {
    const challenge = new Challenges({
      _id: new mongoose.Types.ObjectId(),
      challenge_id: new mongoose.Types.ObjectId(),
      challenge_name,
      start_date,
      end_date,
      description,
      pass_requirement,
      habits_tracked,
      username,
    });

    const newChallenge = await challenge.save();

    res.status(201).json({ newChallenge });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ msg: "Bad Request" });
    } else {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};
exports.getChallenge = async (req: Request, res: Response) => {
  const { username, challenge_id } = req.params;

  try {
    const challenges = await Challenges.find({ username });
    const singleChallenge = challenges.find(
      (challenge: { challenge_id: string }) =>
        challenge.challenge_id === challenge_id
    );
    res.json({ challenge: singleChallenge });
  } catch (err: any) {
    res.status(500).json({ msg: "error" });
  }
};
exports.deleteChallenge = async (req: any, res: any) => {
  const { username, challenge_id } = req.params;
  try {
    const challengeToDelete = await Challenges.findOne({
      username,
      challenge_id,
    });
    if (!challengeToDelete) {
      return res.status(404).json({ msg: "Challenge not found" });
    }
    await Challenges.deleteOne({
      challenge_id: challengeToDelete.challenge_id,
    });
    res.status(204).json();
  } catch (err: any) {
    res.status(400).json({ msg: "Bad Request" });
  }
};
