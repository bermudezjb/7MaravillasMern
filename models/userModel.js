// MODULES
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// MONGOOSE SCHEMA

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Introduce tu nombre"],
  },
  email: {
    type: String,
    required: [true, "Introduce un email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "El email introducido no es correcto"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Introduce una contraseña"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirma la contraseña"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Las contraseñas no coinciden",
    },
  },
});

// MONGOOSE MIDDLEWARES
userSchema.pre("save", async function (next) {
  // If password field is not modified, run next() and exit the middleware
  if (!this.isModified("password")) return next();

  // If password is created or modified, ecnript the password with bcrypt and exit the middleware
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm from document
  this.passwordConfirm = undefined;
  next();
});

// MONGOOSE INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  bodyPassword,
  userPassword
) {
  return await bcrypt.compare(bodyPassword, userPassword);
};

// MONGOOSE MODEL
const User = mongoose.model("User", userSchema);

// Export model
module.exports = User;
