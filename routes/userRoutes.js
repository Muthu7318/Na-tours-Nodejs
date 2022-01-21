const express = require('express');
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/signup').post(authController.signup);
// Router.post('/signup', authController.signup);
Router.route('/login').post(authController.login);
Router.route('/forgotPassword').post(authController.forgotPassword);
Router.route('/resetPassword/:token').patch(authController.resetPassword);
Router.route('/updateMyPassword').patch(
  authController.protect,
  authController.updatePassword
);
Router.patch('/updateMe', authController.protect, userController.updateMe);

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
