const router = require("express").Router();
const tourController = require("../controllers/tourControllers");

//routes
router.route("/").get(tourController.getAllTours).post(tourController.addTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
