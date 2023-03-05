const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 7000;
require("./db/conn");
require("./db/conn.js");
dotenv.config({ path: "./config.env" });

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(require("./routes/auth"));
app.use("/contacts", require("./routes/contact"));

app.get("/", (req, res) => {
  res.send("Server");
});

app.listen(PORT, () => {
  console.log(`Server is up on PORT: ${PORT}`);
});
