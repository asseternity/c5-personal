const express = require("express");
const cors = require("cors");
const apiRoute = express.Router();
const apiController = require("../controllers/apiController");

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
};

// Apply CORS middleware globally to all routes
apiRoute.use(cors(corsOptions));

// Handle OPTIONS preflight requests
apiRoute.options("*", (req, res, next) => {
  console.log("Preflight OPTIONS request received for:", req.url);
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end(); // Respond with status 200 to preflight
  next(); // Continue processing if needed
});

apiRoute.get("/", apiController.getIndex);
apiRoute.post("/sign-up", apiController.postSignUp);
apiRoute.post("/log-in", apiController.postLogIn);
apiRoute.get("/message", apiController.getMessage);
apiRoute.post("/message", apiController.postMessage);
apiRoute.post("/allMessages", apiController.getAllUserMessages);

module.exports = apiRoute;
