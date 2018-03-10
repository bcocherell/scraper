var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String
  },
  summary: {
    type: String
  },
  img: {
    type: String
  },
  // `link` is required and of type String
  link: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: String
  },
  published: {
    type: String
  },
  // `comments` is an object that stores a Comment ids
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
