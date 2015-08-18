var mongoose = require('mongoose');
var config   = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./designer');
require('./temp_user');
require('./image');
require('./plan');
require('./product');
require('./verify_code');
require('./team');
require('./share');
require('./requirement');

exports.User = mongoose.model('User');
exports.Designer  = mongoose.model('Designer');
exports.TempUser = mongoose.model('TempUser');
exports.Image = mongoose.model('Image');
exports.Plan = mongoose.model('Plan');
exports.Product = mongoose.model('Product');
exports.VerifyCode = mongoose.model('VerifyCode');
exports.Team = mongoose.model('Team');
exports.Requirement = mongoose.model('Requirement');
exports.Share = mongoose.model('Share');
