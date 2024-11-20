const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");

const getIndex = async (req, res, next) => {
  if (req.user) {
    const userWithMessages = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { messages: true },
    });
    res.render("index", { user: userWithMessages });
  } else {
    res.render("index", { user: req.user });
  }
};

const postSignUp = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.cpassword) {
      return res.status(400).sent(`Passwords don't match`);
    }
    bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
          isAdmin: false,
        },
      });
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const postLogIn = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle unexpected errors
    }
    if (!user) {
      // Handle login failure
      return res.redirect("/?error=Invalid credentials");
    }
    // Log the user in and establish the session
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log("Logged in user is: ");
      console.log(req.user);
      return res.redirect("/"); // Redirect on success
    });
  })(req, res, next);
};

const getMessage = async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany({});
    res.render("createMessage", { user: req.user, users: allUsers });
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
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getDeleteMessage = async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      const allUsers = await prisma.user.findMany();
      res.render("deleteMessage", { user: req.user, allUsers: allUsers });
    } catch (err) {
      return next(err);
    }
  } else {
    return res.status(401).json({ message: "Unauthorized." });
  }
};

const postDeleteMessage = async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      const { id } = req.params;
      await prisma.message.delete({
        where: {
          id: parseInt(id, 10), // Convert ID to integer if needed
        },
      });
      res.redirect("/deleteMessage");
    } catch (err) {
      return next(err);
    }
  } else {
    return res.status(401).json({ message: "Unauthorized." });
  }
};

module.exports = {
  getIndex,
  postLogIn,
  postSignUp,
  getMessage,
  postMessage,
  getDeleteMessage,
  postDeleteMessage,
};
