const { Router } = require("express");
const { body } = require("express-validator");

const authController = require("../controller/auth");
const User = require("../models/user");

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exits!");
          }
        });
      })
      .normalizeEmail(),
    body("name")
      .trim()
      .isLength({ min: 5 }),
    body("password")
      .trim()
      .isLength({ min: 5 }),
  ],
  authController.signUp
);

router.post("/login", authController.login);

module.exports = router;
