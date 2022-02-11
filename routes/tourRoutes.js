const router = require("express").Router();
const tourController = require("../controllers/tourControllers");
const aliasMiddleware = require("../middlewares/aliasTopTours");
const authController = require("../controllers/authController");
//routes

router
  .route("/top-2-cheap")
  .get(aliasMiddleware.aliasTopTours, tourController.getAllTours);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.addTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
