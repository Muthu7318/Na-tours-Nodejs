const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use(authController.isLoggedIn);
Router.get('/', viewsController.getOverview);
Router.get('/tour/:slug', viewsController.getTour);
Router.get('/login', viewsController.getLoginForm);
module.exports = Router;
