const express = require('express');
const tourController = require('../controllers/toursController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const Router = express.Router();

// Router.param('id', tourController.checkId);

// nested routes for reviews
// Router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );

Router.use('/:tourId/reviews', reviewRouter);
Router.use('/reviews', reviewRouter);

Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAllTour
);
Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/monthlyPlan/:year').get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan
);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(
  tourController.getToursWithin
);
// tours-within?distance=230&center=-40,45&unit=km -- if we used query string
// tours-within/230/center/-40,45/unit/km -- we are using params

Router.route('/')
  .get(tourController.getAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
Router.route('/:id')
  .get(tourController.getATour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = Router;
