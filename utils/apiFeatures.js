class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. Copy query
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    // let query = await Tour.find(queryObject);
    // Step 2: Create a new object to store the formatted query

    const mongoQuery = {};

    // Step 3: Convert bracket keys (like duration[gte]) to nested objects
    Object.keys(queryObj).forEach((key) => {
      const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;

        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][operator] = queryObj[key];
      } else {
        mongoQuery[key] = queryObj[key];
      }
    });

    this.query.find(mongoQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // Convert comma-separated values (e.g., 'price,ratingsAverage') → 'price ratingsAverage'
      const sortBy = this.queryString.sort.split(',').join(' '); //here is queryString.sort
      this.query = this.query.sort(sortBy);
    } else {
      // Optional: default sorting if none specified
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' '); ///here is the queryString.fields used
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; //here is queryString.page
    const limit = this.queryString.page * 1 || 100; //here is queryString.page
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
