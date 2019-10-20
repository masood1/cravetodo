var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var todoApiRouter = require("./routes/todoapi");

var ToDo = require("./models/todo");

var app = express();

var mongoDB = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : "mongodb://127.0.0.1:27017/todo";
mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Cors settings
var allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:9000",
  "https://cravetodo.herokuapp.com/"
];
app.use(
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

// view engine setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/v1/todo", todoApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
