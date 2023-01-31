const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI, function (err) {
    if (err) {
      console.error("Failed to connect to Database", err);
    } else {
      console.log("Database connected successfully");
    }
  });
};

module.exports = connectDatabase;
