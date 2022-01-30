const express = require('express');
const viewsController = require('../controllers/viewsController');
const authConroller = require('../controllers/authController');

const Router = express.Router();

Router.get('/', viewsController.getOverview);
Router.get('/tour/:slug', authConroller.protect, viewsController.getTour);
Router.get('/login', viewsController.getLoginForm);
module.exports = Router;
