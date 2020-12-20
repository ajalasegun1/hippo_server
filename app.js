const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");

//What the app uses
app.use(cookieParser()); //Parse cookies from client
app.use(cors()); //Allow request from other domains
app.use(express.json()); //Allow server accept json data
//Routes to use
app.use("/auth", authRoutes);

//Connect to MongoDB ATLAS online
mongoose.connect(
  process.env.DbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to Database")
);
mongoose.set("useCreateIndex", true);

//Listen for server
app.listen(3001, () => console.log("Listening on port:3001"));
