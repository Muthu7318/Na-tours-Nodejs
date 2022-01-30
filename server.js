const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  // console.log(`${err.name} and ${err.message}`);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection is successful'));

//Creating model out of schema
// const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The road hiker',
//   rating: 4.7,
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err.message));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running in ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`${err.name} and ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

//test
