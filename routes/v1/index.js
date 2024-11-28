const express = require("express");
const app = express();

// const { stageTwo } = require("./stage-two");
const {auth}=require('./auth')
const {stageTwo}=require('./stage-two');
const { order } = require("./order");

app.use("/auth", auth);
app.use("/stage-two",stageTwo)

app.use("/order",order)

module.exports = app;
