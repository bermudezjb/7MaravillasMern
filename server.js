//modules
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const app = require('./app') 

//server

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Geot listenig at port ${port}`);
});


