//modules
const express = require("express");
const tourRoutes = require("./routes/tourRoutes");
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes

app.use("/api/v1/tours", tourRoutes);

module.exports = app;
