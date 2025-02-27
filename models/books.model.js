const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String },
  publishedYear: { type: Number },
  genre: { type: [String] },
  langauge: { type: String },
  country: { type: String },
  rating: { type: Number },
  summary: { type: String },
  coverImageUrl: { type: String },
});

module.exports = mongoose.model("Books", booksSchema);
