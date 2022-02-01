const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourmodel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(val);
//   if (val > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'file not found',
//     });
//   }
//   next();
// };

// exports.checkbody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

const multerStorage = multer.memoryStorage();

// ---  this is to check whether we got image or not
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image! please upload only images', 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// upload.single('image');  -- for single file upload --req.file
// upload.array('image',5); -- for multiple file upload with same field name --req.files

// for multiple file upload with different field name(imageCover and image)
exports.uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  //1) cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) other images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

////////////////////////////////////
//////// with factory handler fn
////////////////////////////////////
exports.getATour = factory.getOne(Tour, 'reviews');
exports.getAllTour = factory.getAll(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numRating: { $sum: '$ratingQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'easy' },
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      tours: stats,
    },
  });
  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTourStarts: { $sum: 1 },
        tourName: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numOfTourStarts: -1,
      },
    },
    // {
    //   $limit: 6,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    count: plan.length,
    data: {
      tours: plan,
    },
  });
  // try {

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

//  '/tours-within/:distance/center/:latlng/unit/:unit'

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in this format lat,lng',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  // console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in this format lat,lng',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});

////////////////////////////////////
//////// without factory handler fn
////////////////////////////////////

// exports.getAllTour = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;

//   //Send Response
//   res.status(200).json({
//     status: 'success',
//     requestTime: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
//   // try {
//   //   //Execute query

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

// exports.getATour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: tour,
//     },
//   });
//   // try {

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
//   // const tour = tours.find((item) => +item.id === +req.params.id);
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tours: tour,
//   //   },
//   // });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body); // calling create method on the tour model itself,create method also returns a promise
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
//   // try {
//   //   // const newTour = new Tour({});
//   //   // newTour.save()

//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: tour,
//     },
//   });
//   // try {

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     message: 'tour deleted',
//   });
//   // try {

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });
