//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//initialize Express app
var app = express();

var Article = require("./models/Article");

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('./public'));

//connecting to MongoDB
var databaseUri = 'mongodb://heroku_lb9cxp3z:o9mfpq8b09cd7ujrs12vvhsjn8@ds115124.mlab.com:15124/heroku_lb9cxp3z';

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}


db.on('error', function(err){
  console.log("Mongoose Error: " + err);
});
db.once('open', function() {
  console.log('Connected to Mongoose!')
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

//grabs all saved articles
app.get("/api/saved", function(req, res){
  Article.find({}).sort([
    ["date", "descending"]
  ]).limit(5).exec(function(err, doc){
    if(err){
      console.log(err);
    } else{
      console.log(doc);
      res.send(doc);
    }
  });
});

app.post("/api/saved", function(req, res){
  console.log('BODY: ' + req.body.article);
  Article.create({
    title: req.body.title,
    date: Date.now(),
    url: req.body.url
  }, function(err) {
    if(err){
      console.log(err);
    } else{
      res.send("Saved Article");
    }
  });
});

app.delete("/api/saved/:id", function(req, res){
  Article.findByIdAndRemove({ _id: req.params.id }, function(err, doc){
    if(err){
      console.log(err);
    } else{
      res.redirect();
    }
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});
