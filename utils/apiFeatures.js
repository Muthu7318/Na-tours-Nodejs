class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) filtering
    // console.log(req.query);
    console.log('filtering');
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    console.log('sorting');
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      //query.sort('price ratingAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    console.log('limit');
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    console.log('paginate');
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);
    //page=2&limit=10 1-10 page1, 11-20 page2, 21-30 page3,...
    this.query = this.query.skip(skip).limit(limit);
    return this;
    //   // if (this.queryString.page) {
    //   //   const numTours = await Tour.countDocuments();
    //   //   if (skip >= numTours) {
    //   //     throw new Error('This page does not exist');
    //   //   }
    //   }
  }
}
module.exports = APIFeatures;
