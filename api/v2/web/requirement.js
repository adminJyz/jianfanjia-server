var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var sms = require('../../../common/sms');
var designer_match_util = require('../../../common/designer_match');
var wkhtmltopdf = require('wkhtmltopdf');
var requirement_util = ('../../../common/requirement_util');

exports.user_my_requirement_list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    userid: userid
  }, null, ep.done(function (requirements) {
    res.sendData(requirements);
  }));
}

exports.designer_my_requirement_list = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Plan.find({
    designerid: designerid,
    status: {
      $in: [type.plan_status_not_respond, type.plan_status_designer_respond_no_housecheck,
        type.plan_status_designer_housecheck_no_plan, type.plan_status_designer_upload,
        type.plan_status_user_final
      ],
    },
  }, null, ep.done(function (plans) {
    if (plans && plans.length > 0) {
      plans = _.uniq(plans, function (p) {
        return p.requirementid.toString();
      });
      async.mapLimit(plans, 3, function (plan, callback) {
        async.parallel({
          requirement: function (callback) {
            Requirement.findOne({
              _id: plan.requirementid,
            }, null, callback);
          },
          user: function (callback) {
            User.findOne({
              _id: plan.userid
            }, {
              username: 1,
              phone: 1,
              imageid: 1
            }, callback);
          }
        }, ep.done(function (result) {
          if (!requirement_util.isDone(result.requirement)) {
            var requirement = result.requirement.toObject();
            requirement.user = result.user;
            requirement.plan = plan;
            callback(null, requirement);
          } else {
            callback(null, null);
          }
        }));

      }, ep.done(function (requirements) {
        _.remove(requirements, function (requirement) {
          return requirement ? false : true;
        });
        res.sendData(requirements);
      }));
    } else {
      return res.sendData([]);
    }
  }));

}

exports.designer_my_requirement_history_list = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var list_type = req.body.list_type || 0;
  var ep = eventproxy();
  ep.fail(next);

  if (list_type === 0) {
    async.parallel({
      invalid_requirements: function (callback) {
        Plan.find({
          designerid: designerid,
          status: {
            $in: [type.plan_status_designer_no_respond_expired, type.plan_status_designer_no_plan_expired,
              type.plan_status_user_not_final, type.plan_status_designer_reject
            ],
          },
        }, null, ep.done(function (plans) {

          plans = _.uniq(plans, function (p) {
            return p.requirementid.toString();
          });
          async.mapLimit(plans, 3, function (plan, callback) {
            Requirement.findOne({
              _id: plan.requirementid,
              final_designerid: {
                $ne: designerid,
              },
            }, null, function (err, requirement) {

              if (requirement) {
                requirement = requirement.toObject();
                requirement.plan = plan;
                callback(err, requirement);
              } else {
                callback(err, null);
              }
            });
          }, function (err, requirements) {
            _.remove(requirements, function (requirement) {
              if (requirement) {
                return false;
              } else {
                return true;
              }
            });
            callback(err, requirements);
          });
        }));
      },
      done_requirements: function (callback) {
        Requirement.find({
          final_designerid: designerid,
          status: {
            $in: [type.requirement_status_done_process, type.requirement_status_final_plan]
          },
        }, null, {
          lean: 1
        }, function (err, requirements) {
          callback(err, requirements);
        });
      },
    }, ep.done(function (result) {
      res.sendData(result.done_requirements.concat(result.invalid_requirements));
    }));
  } else if (list_type === 1) {
    Requirement.find({
      final_designerid: designerid,
      status: {
        $in: [type.requirement_status_done_process, type.requirement_status_final_plan]
      },
    }, null, {
      lean: 1
    }, function (err, requirements) {
      res.sendData(requirements)
    });
  } else {
    var status = undefined;
    if (list_type === 2) {
      status = {
        $in: [type.plan_status_designer_reject],
      };
    } else if (list_type === 3) {
      status = {
        $in: [type.plan_status_designer_no_respond_expired],
      };
    } else if (list_type === 4) {
      status = {
        $in: [type.plan_status_designer_no_plan_expired],
      };
    } else {
      status = {
        $in: [type.plan_status_user_not_final],
      };
    }

    Plan.find({
      designerid: designerid,
      status: status,
    }, null, ep.done(function (plans) {
      plans = _.uniq(plans, function (p) {
        return p.requirementid.toString();
      });
      async.mapLimit(plans, 3, function (plan, callback) {
        Requirement.findOne({
          _id: plan.requirementid,
          final_designerid: {
            $ne: designerid,
          },
        }, null, function (err, requirement) {
          if (requirement) {
            requirement = requirement.toObject();
            requirement.plan = plan;
            callback(err, requirement);
          } else {
            callback(err, null);
          }
        });
      }, function (err, requirements) {
        _.remove(requirements, function (requirement) {
          if (requirement) {
            return false;
          } else {
            return true;
          }
        });
        res.sendData(requirements);
      });
    }));
  }
}

exports.user_add_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  requirement.userid = userid;
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();
  ep.fail(next);

  Designer.find({
    city: requirement.city,
    auth_type: type.designer_auth_type_done,
    agreee_license: type.designer_agree_type_yes,
    online_status: type.online_status_on,
    authed_product_count: {
      $gte: 3
    },
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      order_count: 1,
      authed_product_count: -1,
      login_count: -1,
    }
  }, ep.done(function (designers) {;
    ep.emit('final', designer_match_util.top_designers(
      designers,
      requirement));
  }));

  ep.on('final', function (designers) {
    //设计确定了
    var designerids = _.pluck(designers, '_id');
    requirement.rec_designerids = designerids;

    Requirement.newAndSave(requirement, ep.done(function (requirement_indb) {
      res.sendData({
        requirementid: requirement_indb._id,
      });

      User.findOne({
        _id: userid
      }, null, function (err, user) {
        if (user) {
          sms.sendYzxRequirementSuccess(user.phone, [
            user.username
          ]);
        }
      });
    }));
  });
}

exports.user_update_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  var _id = req.body._id;
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();
  ep.fail(next);

  Designer.find({
    city: requirement.city,
    auth_type: type.designer_auth_type_done,
    agreee_license: type.designer_agree_type_yes,
    online_status: type.online_status_on,
    authed_product_count: {
      $gte: 3
    },
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      order_count: 1,
      authed_product_count: -1,
      login_count: -1,
    }
  }, ep.done(function (designers) {
    ep.emit('final', designer_match_util.top_designers(designers,
      requirement));
  }));

  ep.on('final', function (designers) {
    //设计确定了
    var designerids = _.pluck(designers, '_id');
    requirement.rec_designerids = designerids;
    requirement.last_status_update_time = new Date().getTime();
    Requirement.setOne({
        _id: _id,
        status: type.requirement_status_new,
      },
      requirement, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
  });
};

exports.user_one_requirement = function (req, res, next) {
  var query = req.body;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.findOne(query, null, ep.done(function (plan) {
    res.sendData(plan);
  }));
}

exports.designer_one_requirement = function (req, res, next) {
  var query = req.body;
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.findOne(query, null, ep.done(function (requirement) {
    if (!requirement) {
      return res.sendErrMsg('需求不存在');
    }

    User.findOne({
      _id: requirement.userid
    }, {
      username: 1,
      phone: 1,
      imageid: 1
    }, ep.done(function (user) {
      requirement = requirement.toObject();
      requirement.user = user;

      Plan.find({
        designerid: designerid,
        requirementid: requirement._id,
      }, {
        status: 1,
        house_check_time: 1,
        get_phone_time: 1,
      }, {
        skip: 0,
        limit: 1,
        sort: {
          last_status_update_time: -1
        },
      }, ep.done(function (plans) {
        if (plans && plans.length > 0) {
          requirement.plan = plans[0];
        }

        res.sendData(requirement);
      }));
    }));
  }));
}

exports.one_contract = function (req, res, next) {
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.findOne({
    _id: requirementid,
    status: {
      $in: [type.requirement_status_final_plan, type.requirement_status_config_contract,
        type.requirement_status_config_process, type.requirement_status_done_process
      ]
    }
  }, null, ep.done(function (requirement) {
    if (!requirement) {
      return res.sendData({});
    }

    async.parallel({
      plan: function (callback) {
        Plan.findOne({
          _id: requirement.final_planid
        }, {
          duration: 1,
          total_price: 1,
        }, callback);
      },
      designer: function (callback) {
        Designer.findOne({
          _id: requirement.final_designerid
        }, {
          username: 1,
          phone: 1,
          uuid: 1,
          imageid: 1,
          province: 1,
          city: 1,
          district: 1,
          auth_type: 1,
          uid_auth_type: 1,
          work_auth_type: 1,
          email_auth_type: 1,
        }, callback);
      },
      user: function (callback) {
        User.findOne({
          _id: requirement.userid
        }, {
          username: 1,
          phone: 1,
          imageid: 1,
          province: 1,
          city: 1,
          district: 1,
        }, callback);
      },
    }, ep.done(function (result) {
      requirement = requirement.toObject();
      requirement.plan = result.plan;
      requirement.designer = result.designer;
      requirement.user = result.user;

      res.sendData(requirement);
    }));
  }));
}

exports.config_contract = function (req, res, next) {
  var requirementid = req.body.requirementid;
  var start_at = req.body.start_at;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.setOne({
    _id: requirementid,
    status: {
      $in: [type.requirement_status_config_contract, type.requirement_status_final_plan]
    }
  }, {
    start_at: start_at,
    status: type.requirement_status_config_contract,
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.download_contract = function (req, res, next) {
  var requirementid = req.params._id;
  var ep = eventproxy();
  ep.fail(next);

  wkhtmltopdf('http://www.jianfanjia.com/tpl/guide/index.html?1', {
    javascriptDelay: 500
  }).pipe(res);
}
