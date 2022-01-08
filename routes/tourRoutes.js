const express = require('express');
const tourController = require('../controllers/toursController');

const Router = express.Router();

// Router.param('id', tourController.checkId);

Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAllTour
);
Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/monthlyPlan/:year').get(tourController.getMonthlyPlan);
Router.route('/')
  .get(tourController.getAllTour)
  .post(tourController.createTour);
Router.route('/:id')
  .get(tourController.getATour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;
