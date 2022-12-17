const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { reset } = require("nodemon");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// ===================================================================

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1/wikiDB");

// schema
const articleSchema = {
  title: String,
  content: String,
};

// model
const Article = mongoose.model("Article", articleSchema);

// route home
app.get("/", (req, res) => {
  res.send("hello world!");
});

// route semua artikel
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article to database");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully delete all articles");
      } else {
        res.send(err);
      }
    });
  });

// route detail artikel
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send("No article matching that title was found");
      }
    });
  })
  .put((req, res) => {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    Article.replaceOne(
      { title: req.params.articleTitle },
      {
        title: articleTitle,
        content: articleContent,
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        }
      }
    );
  })
  .patch((req, res) => {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    Article.updateOne(
      { title: req.params.articleTitle },
      {
        $set: req.body,
      },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
