const express = require("express");
const apiRoute = express.Router();
const apiController = require("../controllers/apiController");
const cors = require("cors");

// set up cors
const corsOptions = {
  origin: [
    "https://asseternity.github.io",
    "https://c5-personal-production.up.railway.app",
  ],
  methods: ["GET", "POST"],
};

apiRoute.use(cors(corsOptions));

apiRoute.get("/", apiController.getIndex);
apiRoute.post("/sign-up", apiController.postSignUp);
apiRoute.post("/log-in", apiController.postLogIn);
apiRoute.get("/message", apiController.getMessage);
apiRoute.post("/message", apiController.postMessage);
apiRoute.post("/allMessages", apiController.getAllUserMessages);

module.exports = apiRoute;
