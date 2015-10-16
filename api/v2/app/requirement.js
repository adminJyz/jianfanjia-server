var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var sms = require('../../../common/sms');
var designer_match_util = require('../../../common/designer_match');

exports.user_my_requiremtne_list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    userid: userid
  }, null, ep.done(function (requirements) {
    if (requirements.length > 0) {
      async.mapLimit(requirements, 3, function (requirement, callback) {
        requirement = requirement.toObject();
        if (requirement.order_designerids && requirement.order_designerids
          .length > 0) {
          Designer.find({
            _id: {
              $in: requirement.order_designerids,
            },
          }, {
            username: 1,
            imageid: 1,
          }, null, ep.done(function (designers) {
            async.mapLimit(designers, 3, function (designer,
              callback) {
              Plan.find({
                designerid: designer._id,
                requirementid: requirement._id,
              }, null, {
                skip: 0,
                limit: 1,
                sort: {
                  last_status_update_time: -1
                },
              }, function (err, plans) {
                designer = designer.toObject();
                designer.status = plans[0].status;
                callback(err, designer);
              });
            }, ep.done(function (designers) {
              requirement.order_designers = designers;
              callback(null, requirement);
            }));
          }));
        } else if (requirement.rec_designerids && requirement.rec_designerids
          .length > 0) {
          Designer.find({
            _id: {
              $in: requirement.rec_designerids,
            },
          }, {
            username: 1,
            imageid: 1,
          }, null, ep.done(function (designers) {
            requirement.rec_designers = designers;
            callback(null, requirement);
          }));
        }
      }, ep.done(function (requirements) {
        res.sendData(requirements);
      }));
    } else {
      res.sendData([]);
    }
  }));
}