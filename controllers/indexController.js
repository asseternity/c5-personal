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

const postLogIn = async (req, res, next) => {
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

const getMessage = async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany({});
    res.render('createMessage', { user: req.user, users: allUsers });
  } catch(err) {
    console.log(err);
    return next(err);
  }
}

const postMessage = async (req, res, next) => {
  try {
    const recipientId = parseInt(req.body.recipient);

    await prisma.message.create({
      data: {
        name: req.body.name,
        text: req.body.text,
        userId: recipientId,
      }
    });

    res.redirect('/');
  } catch(err) {
    console.log(err);
    return next(err);
  }
}

module.exports = { getIndex, postLogIn, postSignUp, getMessage, postMessage };
