//modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES
// set security http headers middleware
app.use(helmet());

//development looger middleware
app.use(cors());

// bosy parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// data sanitization
app.use(mongoSanitize());

// data sanitization
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "difficulty",
      "ratingAverage",
      "price",
    ],
  })
);

//rate limiter middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "demasiada peticiones desde esta IP, intentalo de nuevo en una hora",
});
app.use("/api", limiter);

// routes
// tour routes
app.use("/api/v1/tours", tourRoutes);
// user routes
app.use("/api/v1/users", userRoutes);

module.exports = app;
