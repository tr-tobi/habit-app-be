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

export default getUser;
