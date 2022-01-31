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

Router.get('/', authController.isLoggedIn, viewsController.getOverview);
Router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
Router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
Router.get('/me', authController.protect, viewsController.getAccount);
module.exports = Router;
