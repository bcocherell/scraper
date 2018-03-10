// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

// Require db models
var db = require("../models");

// get route -> index
router.get("/", function(req, res) {
  // send us to the articles.
  res.redirect("/articles");
});

// get route, retrieves all article records from db
router.get("/articles", function(req, res) {

  db.Article.find({}).sort({"published":-1})
    .then(function(dbArticle) {
      var articles = {
        articles: dbArticle
      };
      return res.render("index", articles);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/scrape", function(req, res) {

  var newArticles = 0;

  // First, we grab the body of the html with request
  request("https://www.snopes.com/", function(error, response, html) {

    if (error) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    }

    // use cheerio
    var $ = cheerio.load(html);

    // loop through every article, saving information to a result object
    $('div.article-links-wrapper.grid-view').children('article').each(function(i, element) {

      var result = {};

      result.link = $(this).children('a').attr("href")
      
      result.img = $(this)
        .children('a')
        .children('span[itemprop="image"]')
        .children('meta[itemprop="url"]')
        .attr("content");

      result.summary = $(this)
        .children('a')
        .children('div[class="article-link-container"]')
        .children('p')
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();
      
      result.title = $(this)
        .children('a')
        .children('div[class="article-link-container"]')
        .children('h2')
        .text();

      result.date = $(this)
        .children('a')
        .children('div[class="article-link-container"]')
        .children('p')
        .children('span')
        .text();

      result.published = $(this)
        .children('a')
        .children('meta[itemprop="datePublished"]')
        .attr("content");

      var query = {'link':result.link};
      
      db.Article.findOneAndUpdate(query, result, {upsert:true, setDefaultsOnInsert:true, new:false})
        .then(function(dbArticle) {
          
          if (dbArticle == null) {
            newArticles++;
          }

          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
  });
  res.send("scrape successful");
});

// Route for grabbing a specific Article by id, populate it with its comments
router.get("/articles/:id", function(req, res) {
  
  db.Article.findOne({ _id: req.params.id })
    // populate all of the comments associated with article
    .populate("comments")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment._id }}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/comments/:id", function(req, res) {
  // Delete Comment by id value provided
  db.Comment.remove({ _id: req.params.id })
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;