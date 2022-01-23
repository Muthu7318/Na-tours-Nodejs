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
Router.route('/monthlyPlan/:year').get(tourController.getMonthlyPlan);
Router.route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createTour);
Router.route('/:id')
  .get(tourController.getATour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = Router;
