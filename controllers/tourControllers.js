//modules

const Tour = require("../models/tourModels");

// controllers
//get all tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "sucess",
      results: Tour.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "error",
    });
  }
};

// get tour by id
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "sucess",
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "error",
    });
  }
};
// add tour new
exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: "sucess",
      data: { tours: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "error",
    });
  }
};
// update tour by id
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "sucess",
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "error",
    });
  }
};
// delete tour by id
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "sucess",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "error",
    });
  }
};
