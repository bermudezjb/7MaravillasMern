//modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");

//database conection
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Conection successfull!"));

//server

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`7 maravillas listenig at port ${port}`);
});
