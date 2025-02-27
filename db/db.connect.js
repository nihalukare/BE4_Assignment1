const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

function initializeDatabase() {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to the database successfully.");
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = { initializeDatabase };
