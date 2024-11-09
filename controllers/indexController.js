const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");

const getIndex = (req, res, next) => {
  res.render("index", { user: req.user });
};

const postSignUp = (req, res, next) => {
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
  try {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    })(req, res, next);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

module.exports = { getIndex, postLogIn, postSignUp };
