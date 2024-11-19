const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");

const getIndex = async (req, res, next) => {
  if (req.body.user) {
    const userWithMessages = await prisma.user.findUnique({
      where: { id: req.body.user.id },
      include: { messages: true },
    });
    res.json({ user: userWithMessages });
  }
  res.json({ user: req.body.user });
};

const postSignUp = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.cpassword) {
      return res.status(400).send(`Passwords don't match`);
    }
    bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
          isAdmin: false,
        },
      });
      res.json({ message: "Success" });
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const postLogIn = async (req, res, next) => {
  console.log("Log-in request received:", req.body);
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err); // Handle errors properly
      }
      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }
      // Log the user in and create the session
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // Log user
        console.log("Session Data:", req.session);
        console.log("User Data:", req.user);
        // Login successful; send the user data
        res.json(user);
      });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getMessage = async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany({});
    res.json({ user: req.body.user, users: allUsers });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const postMessage = async (req, res, next) => {
  const recipientIds = req.body.recipientId;

  if (!recipientIds || recipientIds.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one recipient must be selected." });
  }

  if (!req.body.name || !req.body.text) {
    return res
      .status(400)
      .json({ message: "Please write a title and a text of the message." });
  }

  try {
    if (Array.isArray(req.body.recipientId)) {
      for (let i = 0; i < recipientIds.length; i++) {
        const correctRecipientId = parseInt(recipientIds[i]);
        await prisma.message.create({
          data: {
            name: req.body.name,
            text: req.body.text,
            userId: correctRecipientId,
          },
        });
      }
      res.json({ message: "Success" });
    } else {
      const recipientId = parseInt(req.body.recipientId);
      await prisma.message.create({
        data: {
          name: req.body.name,
          text: req.body.text,
          userId: recipientId,
        },
      });
      res.json({ message: "Success" });
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getAllUserMessages = async (req, res, next) => {
  console.log("Fetching all messages for user:", req.body.user);

  if (req.body.user) {
    try {
      const allMessages = await prisma.message.findMany({
        where: {
          userId: req.body.user.id,
        },
      });
      return res.json(allMessages);
    } catch (err) {
      return next(err);
    }
  } else {
    return res.status(401).send(`You are not authenticated`);
  }
};

module.exports = {
  getIndex,
  postLogIn,
  postSignUp,
  getMessage,
  postMessage,
  getAllUserMessages,
};
