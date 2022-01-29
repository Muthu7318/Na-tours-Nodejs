const Tour = require('../models/tourmodel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();
  //2) build template

  //3) Render that template using tour data from 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1) get the data for the requested tour (including tours and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  //2) build template

  //3) render template using data from 1
  console.log('tour obj is');
  console.log(tour);
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour,
  });
});
