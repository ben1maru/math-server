const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const levelRoutes = require('./routes/level');
const themeRoutes = require('./routes/themes');
const scoreboardRoutes = require('./routes/scorebord')
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes)
app.use('/api/level', levelRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/scoreboard', scoreboardRoutes);

app.get("/", (re, res) => {
  return res.json("from backend");
});


module.exports=app;