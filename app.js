/* eslint-disable prettier/prettier */
const express = require('express');

const app = express();

// it is a common practice to have all express code in app.js

const morgan = require('morgan'); //Thirdparty middleware
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Third party middleware
}
app.use(express.json()); // app.use is used for defining the middleware..Express.json here is a middleware, it is basically a function that modify the incoming request data
app.use(express.static(`${__dirname}/public/`));
// ROUTES
app.use('/api/v1/tours', tourRouter); // this is called as mounting a router
app.use('/api/v1/users', userRouter);

module.exports = app;
// MIDDLEWARE
// app.use(morgan('dev')); // Third party middleware

// app.use((req, res, next) => {
//   console.log('Hello from middleware'); // our own middleware that we defined
//   next(); // it is very important to call next middleware
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// // app.get is the http method for getting the request
// app.get('/', (req, res) => {
//   // res.status(200).send('Hello from server side'); // This will send string to the client
//   res.status(200).json({ message: 'Hello from server side' }); // This will send json to the client. This will automatically set the content type to json.we can see the content type in post man headers tab after sending get request
// });
// // app.post  is the http method for getting the request
// app.post('/', (req, res) => {
//   res.send('you can post now..');
// });

// ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTour);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getATour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);