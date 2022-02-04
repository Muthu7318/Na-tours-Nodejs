const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use((req, res, next) => {
  // Website you wish to allow to connect

  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.set(
    'Content-Security-Policy',
    "connect-src 'self' http://localhost:3000/"
  );
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  // res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

Router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckOutSession
);

module.exports = Router;
