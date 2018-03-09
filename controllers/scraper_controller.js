// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

// Require db models
var db = require("../models");

// get route -> index
router.get("/", function(req, res) {
  // send us to the next get function instead.
  res.redirect("/articles");
});

// get route, edited to match sequelize
router.get("/articles", function(req, res) {
  // replace old function with sequelize function
  db.Article.find({}).sort({"date":-1})
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
  request({
    url: "https://www.giantbomb.com/",
    headers: {'User-Agent': 'Mozilla/5.0'}
  }, function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // Now, we grab every h2 within an article tag, and do the following:
    $("p.editorial-excerpt").each(function(i, element) {
      // Save an empty result object
      var result = {};

      result.excerpt = $(this).text();
      
      result.img = $(this)
        .siblings(".editorial-img")
        .children("img")
        .attr("src");

      result.title = $(this)
        .siblings(".editorial-title")
        .text();

      result.byline = $(this)
        .siblings(".editorial-byline")
        .text();
          
      result.link = $(this)
        .parent("a")
        .attr("href");


      var query = {'link':result.link};
      
      db.Article.findOneAndUpdate(query, result, {upsert:true, setDefaultsOnInsert:true, new:false})
        .then(function(dbArticle) {
          // View the added result in the console
          if (dbArticle == null) {
            newArticles++;
          }
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
  });
  res.send("Scrape Complete");
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
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
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
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
  db.Comment.remove({ _id: req.params.id })
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;

// module.exports = function(app) {

//   // A GET route for scraping the echojs website

//   // Route for getting all Articles from the db
//   app.get("/api/articles", function(req, res) {
//     db.Article.find({}).sort({"date":-1})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

//   // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/api/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("comments")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

//   //Route for saving/updating an Article's associated Note
//   app.post("/api/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Comment.create(req.body)
//       .then(function(dbComment) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment._id }}, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
// };
