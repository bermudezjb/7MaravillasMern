//modules
const express = require("express");
const tourRoutes = require("./routes/tourRoutes");
const app = express();

// routes

app.use('/api/v1/tours',tourRoutes)
// app.use('/api/v1/users', userRoutes)

module.exports = app;
