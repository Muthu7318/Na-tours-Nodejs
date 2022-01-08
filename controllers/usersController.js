const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

exports.createUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};
