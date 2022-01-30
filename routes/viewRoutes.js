const express = require('express');
const viewsController = require('../controllers/viewsController');

const Router = express.Router();

Router.get('/', viewsController.getOverview);
Router.get('/tour/:slug', viewsController.getTour);
Router.get('/login', viewsController.getLoginForm);
module.exports = Router;
