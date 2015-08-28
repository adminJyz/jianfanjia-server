var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Share = require('../../proxy').Share;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');


exports.list = function (req, res, next) {
  Share.getAll(function (err, shares) {
    if (err) {
      return next(err);
    }

    res.sendData(shares);
  });
}

exports.listtop = function (req, res, next) {
  Share.getByRange(config.index_top_share_count, function (err, shares) {
    if (err) {
      return next(err);
    }

    res.sendData(shares);
  });
}

exports.getOne = function (req, res, next) {
  var _id = req.params._id;

  Share.getOneById(_id, function (err, share) {
    if (err) {
      return next(err);
    }

    res.sendData(share);
  });
}
