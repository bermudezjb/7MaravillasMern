exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "2";
  req.query.sort = "price";
  req.query.fields = "name, price, ratingsAverage, sumary, dificulty";
  next();
};
