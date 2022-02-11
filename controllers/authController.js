// modules
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");

//sign token function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create and send token to client function
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; //https secure way

  //send cookie to client
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
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

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
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
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// protect routes middlewares function

exports.protect = async (req, res, next) => {
  try {
    // 1. get user token and check if it exist
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new Error("debes iniciar sesión para tener acceso");

    // 2.verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3.check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      throw new Error("el usuario al que pertenece este token ya no existe");

    // 4.check if user changed password
    if (currentUser.changePassword(decoded.iat))
      throw new Error(
        "el usuario cambió la contrasena recientemente, por favor ingresa de nuevo"
      );
    // save current user in req.user
    req.user = currentUser;
    //finish the middleware and continue
    next();
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// restrict routes middlewares function
exports.restrictTo = (...role) => {
  // ['admin','lead-guide']
  return (req, res, next) => {
    try {
      //if roles array doesn´t include req.user.role throw error
      if (!role.includes(req.user.role)) {
        throw new Error(
          "no tienes permisos de admin para realizar esta accion"
        );
      }
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error.message,
      });
    }
  };
};

// forgot password function

exports.forgotPassword = async (req, res) => {
  try {
    // 1) Get user based on POST email
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("No existe un usuario con ese email");

    // 2. generate reset random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3. send token to user´s mail
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;

    const subject = "enlace para reetrablecer la contrasena (valido 10 min)";

    const message =
      "¿olvidaste tu contrasena? envia una solictud patch con tu nueva contrasena y la confirmacion de la misma a esta URL: ${resetURL}.\n si no has solicitado restablecer tu contrasena, ignora este msj";

    try {
      // call sendEmail function
      await sendEmail({
        email: user.email,
        subject,
        message,
      });

      // send response to client
      res.status(200).json({
        status: "success",
        messsage: "URL de restableciemiento de contrasena enviada al email",
      });
    } catch (error) {
      (user.passwordResetToken = undefined),
        (user.passwordResetExpires = undefined),
        await user.save({ validateBeforeSave: false });
      throw new Error("hubo un error enviando el email, intenta de nuevo ");
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
//reset password
exports.resetPassword = async (req, res) => {
  try {
    // 1.get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //2. if token has not expired and the user exits, set new password
    if (!user) throw new Error("el token es invalido o ha expirado");

    (user.password = req.body.password),
      (user.passwordConfirm = req.body.passwordConfirm),
      (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined);

    //save user document on BBDD
    await user.save();

    //3.log the user in, send jwt to the client

    //4.log the user in, send jwt to the client
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// update logged user password

exports.updatePassword = async (req, res) => {
  try {
    // 1.get the user from DB
    const user = await User.findByIdAndUpdate(req.user.id).select("+password");

    //2. check if post current password is correct
    const passwordMatch = await user.correctPassword(
      req.body.passwordCurrent,
      user.password
    );
    if (!passwordMatch) throw new Error("contrasena incorrecta");
    //3. if current password is right, update with new password

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    //4. log the user in, send jwt
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
// update user data
exports.updateMyData = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "sucess",
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// delete current user account

exports.deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "sucess",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
