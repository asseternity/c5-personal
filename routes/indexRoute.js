const express = require("express");
const indexRoute = express.Router();
const indexController = require("../controllers/indexController");

indexRoute.get("/", indexController.getIndex);
indexRoute.post("/sign-up", indexController.postSignUp);
indexRoute.post("/log-in", indexController.postLogIn);
indexRoute.get("/message", indexController.getMessage);
indexRoute.post("/message", indexController.postMessage);
indexRoute.get("/deleteMessage", indexController.getDeleteMessage);
indexRoute.post("/deleteMessage/:messageId", indexController.postDeleteMessage);

module.exports = indexRoute;
