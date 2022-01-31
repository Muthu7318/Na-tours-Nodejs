const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use((req, res, next) => {
  res.set(
    'Content-Security-Policy',
    "connect-src 'self' http://127.0.0.1:3000/"
  );
  next();
});
Router.use(authController.isLoggedIn);
Router.get('/', viewsController.getOverview);
Router.get('/tour/:slug', viewsController.getTour);
Router.get('/login', viewsController.getLoginForm);
module.exports = Router;
