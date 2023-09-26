var { config } = require("dotenv");

config();

exports.DATABASE_URL = process.env.DATABASE_URL as string;
