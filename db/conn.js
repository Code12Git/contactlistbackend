const mongoose = require("mongoose");

const connectionurl =
  process.env.DATABASE ||
  "mongodb+srv://Sak12:Saxena@cluster0.os363zi.mongodb.net/contact?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.set("debug", true);
mongoose
  .connect(connectionurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established");
  })
  .catch((error) => {
    console.log(error);
  });
