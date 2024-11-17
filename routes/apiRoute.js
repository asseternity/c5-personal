const express = require("express");
const apiRoute = express.Router();
const apiController = require("../controllers/apiController");

apiRoute.get("/", apiController.getIndex);
apiRoute.post("/sign-up", apiController.postSignUp);
apiRoute.post("/log-in", apiController.postLogIn);
apiRoute.get("/message", apiController.getMessage);
apiRoute.post("/message", apiController.postMessage);
apiRoute.post("/allMessages", apiController.getAllUserMessages);

module.exports = apiRoute;
