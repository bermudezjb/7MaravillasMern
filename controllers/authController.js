// modules
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//sign token function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//controllers
//sign up function
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // create token

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "succes",
      token,
      data: { user: newUser },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// login function

exports.login = async (req, res) => {
  try {
    // destructuring email and password fron req.body
    const { email, password } = req.body;

    // 1. check if email and pass exist
    if (!email || !password) {
      throw new Error("debes introducir el email o contrasena");
    }

    // 2. check if user exist and pass is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("email o contrasena incorrectos");
    }

    // 3. if everything is ok, send the token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
