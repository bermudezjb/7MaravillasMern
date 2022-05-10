//modules
const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// routes
// signup route
router.post("/signup", authController.signup);
//login route
router.post("/login", authController.login);
// forgot password route
router.post("/forgot-password", authController.forgotPassword);
//reset password
router.patch("/reset-password/:Token", authController.resetPassword);
//update password route
router.patch(
  "/update-my-password",
  authController.protect,
  authController.updatePassword
);

// update currrent user data
router.patch(
  "/update-my-data",
  authController.protect,
  authController.updateMyData
);
//delete current user account
router.delete(
  "/delete-my-account",
  authController.protect,
  authController.deleteMyAccount
);

//main routes
router.route("/").get(userController.getAllUsers).post(userController.addUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// export

module.exports = router;
