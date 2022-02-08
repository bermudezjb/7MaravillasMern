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
  .post(tourController.addTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
