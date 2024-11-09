const express = require("express");
const indexRoute = express.Router();
const indexController = require("../controllers/indexController");

indexRoute.get("/", indexController.getIndex);
indexRoute.post("/sign-up", indexController.postSignUp);
indexRoute.post("/log-in", indexController.postLogIn);

module.exports = indexRoute;
