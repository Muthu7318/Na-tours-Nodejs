const Tour = require('../models/tourmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();
  //2) build template

  //3) Render that template using tour data from 1

  res
    .status(200)
    // .set('Content-Security-Policy', "connect-src 'self' http://127.0.0.1:3000/")
    .render('overview', {
      title: 'All Tours',
      tours: tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) get the data for the requested tour (including tours and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('there is no tour with this name', 404));
  }
  //2) build template

  //3) render template using data from 1
  // console.log('tour obj is');
  // console.log(tour);

  res
    .status(200)
    // .set('Content-Security-Policy', "connect-src 'self' http://127.0.0.1:3000/")
    .render('tour', {
      title: tour.name,
      tour: tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    // .set('Content-Security-Policy', "connect-src 'self' http://127.0.0.1:3000/")
    .render('login', {
      title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'your account',
  });
};
