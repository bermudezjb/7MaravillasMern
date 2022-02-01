// Api features class
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1a) filtrado
    //page,sort, limit, field
    //creando una copia de req.query

    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObj[element]);

    //filtro avanzado
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Regular expresion

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //2 sort
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("price");
    }
    return this;
  }

  limitfields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  //paginate  method

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 2;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
