var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();

var usersSchema = require("../models/usersSchema");

const Users = mongoose.model("Users", usersSchema);

exports.getAllUsers =  async (req: any, res: any) => {
  
    try {
      const users = await Users.find();
      res.json({ users: users });
    } catch (err) {
      res.status(500).json({ msg: "error" });
    }
  }
exports.postUser = async (req: any, res: any) => {
        const user = new Users({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          habit_categories: [],
          challenges: [],
          habits: [],
          notes: [],
        });
        try {
          const newUser = await user.save();
          res.status(201).json({ user: newUser });
        } catch (err: any) {
          res.status(400).json({ msg: "Bad Request" });
        }
      }

