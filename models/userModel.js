// MODULES
const crypto = require("crypto");
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
  role: {
    type: String,
    enum: ["user", "admin", "guide", " lead-guide"],
    default: "user",
  },
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
  passwordChangedAt: Date,
  PasswordResetToken: String,
  PasswordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// MONGOOSE MIDDLEWARES
//encrypt password before saving
userSchema.pre("save", async function (next) {
  // If password field is not modified, run next() and exit the middleware
  if (!this.isModified("password")) return next();

  // If password is created or modified, ecnript the password with bcrypt and exit the middleware
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm from document
  this.passwordConfirm = undefined;
  next();
});

// upddate passwordChangeAt field middleware
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  // only if password is modfiied, update 'passwordCahngeAt' field with current date + 1 seg
  this.passwordChangedAt = Date.now() + 1000;
  next();
});

// find users with 'active' field set to 'true'only
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

// MONGOOSE INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  bodyPassword,
  userPassword
) {
  return await bcrypt.compare(bodyPassword, userPassword);
};

// check if password change after user was assyng
userSchema.methods.changePassword = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < changedTimestamp;
  }

  // false means NOT changed
  return false;
};

// create random token to reset password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // set reset token to passwordResetToken  field ecripted
  this.PasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //set passwordResetExpires
  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  console.log(this.PasswordResetExpires);
  return resetToken;
};

// MONGOOSE MODEL
const User = mongoose.model("User", userSchema);

// Export model
module.exports = User;
