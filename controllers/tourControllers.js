//modules




// controllers


exports.getAllTours = (req, res) => {
    res.status(200).json({
      status: "sucess",
      data: { tours: "GET ALL TOURS " },
    });
  }

exports.getTour = (req, res) => {
    res.status(200).json({
      status: "sucess",
      data: { tours: "GET TOURS by id " },
    });
  }

exports.addTour =  (req, res) => {
    res.status(200).json({
      status: "sucess",
      data: { tours: "ADD TOUR" },
    });
  }

exports.updateTour = (req, res) => {
    res.status(200).json({
      status: "sucess",
      data: { tours: "TOUR UPDATED" },
    });
  }

exports.deleteTour = (req, res) => {
    res.status(204).json({
      status: "sucess",
      data: null,
    });
  }
  