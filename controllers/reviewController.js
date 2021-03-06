const Review = require('../models/reviewModel');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};

////////////////////////////////////
//////// without factory handler fn
////////////////////////////////////

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) {
//     filter = {
//       tour: req.params.tourId,
//     };
//   }

//   const reviews = await Review.find(filter).populate({
//     path: 'tour',
//     select: 'name',
//   });

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newReview,
//     },
//   });
// });

////////////////////////////////////
//////// with factory handler fn
////////////////////////////////////
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review, {
  path: 'tour',
  select: 'name',
});
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
