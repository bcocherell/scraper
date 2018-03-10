var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: String
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;