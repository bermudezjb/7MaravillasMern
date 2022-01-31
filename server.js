//modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");

//db conection
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Concetion successfull!"));

//server

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Geot listenig at port ${port}`);
});
