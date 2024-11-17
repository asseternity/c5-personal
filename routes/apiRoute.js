const express = require("express");
const cors = require("cors");
const apiRoute = express.Router();
const apiController = require("../controllers/apiController");

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
};

apiRoute.use(cors(corsOptions));

apiRoute.get("/", apiController.getIndex);
apiRoute.post("/sign-up", apiController.postSignUp);
apiRoute.post("/log-in", apiController.postLogIn);
apiRoute.get("/message", apiController.getMessage);
apiRoute.post("/message", apiController.postMessage);
apiRoute.post("/allMessages", apiController.getAllUserMessages);

module.exports = apiRoute;
