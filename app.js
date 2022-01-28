/* eslint-disable prettier/prettier */
const path = require('path');
const express = require('express');
const morgan = require('morgan'); //Thirdparty middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
// it is a common practice to have all express code in app.js

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middlewares

//serving static files
// app.use(express.static(`${__dirname}/public/`));
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());
// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Third party middleware
}

// limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});
app.use('/api', limiter);

// body parser
app.use(
  express.json({
    limit: '10kb',
  })
); // app.use is used for defining the middleware..Express.json here is a middleware, it is basically a function that modify the incoming request data

// Data sanitization against nosql query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xssClean());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});
// ROUTES
app.get('*', (req, res) => {
  res.status(200).render('base');
});
app.use('/api/v1/tours', tourRouter); // this is called as mounting a router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `cant find ${req.originalUrl} on the server`,
  // });

  // const err = new Error(`cant find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
// MIDDLEWARE
// app.use(morgan('dev')); // Third party middleware

// app.use((req, res, next) => {
//   console.log('Hello from middleware'); // our own middleware that we defined
//   next(); // it is very important to call next middleware
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
