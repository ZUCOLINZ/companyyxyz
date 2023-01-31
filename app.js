const express = require("express");
const app = express();
const cors = require("cors");

const userRouter = require("./routes/user");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ status: true, message: "Welcome to XYZ company" });
}); // backend landing route

app.use("/auth", userRouter);


module.exports = app;
