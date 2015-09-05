var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Reschedule = require('../../proxy').Reschedule;
var Requirement = require('../../proxy').Requirement;
var Process = require('../../proxy').Process;
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var DateUtil = require('../../common/date_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');
var async = require('async');
var gt = require('../../getui/gt.js');

exports.start = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var process = ApiUtil.buildProcess(req);

  //删除老工地，每一个用户只能有一个工地
  Process.removeOneByQuery({
    userid: userid
  }, function (err) {
    if (err) {
      return next(err);
    }
  });

  process.userid = userid;
  process.going_on = type.process_section_kai_gong;
  process.sections = [];

  process.sections[0] = {}
  process.sections[0].name = type.process_section_kai_gong;
  process.sections[0].status = type.process_item_status_going;
  process.sections[0].items = [];
  process.sections[0].items[0] = {};
  process.sections[0].items[0].name = type.process_kai_gong_item_xcjd;
  process.sections[0].items[0].status = type.process_item_status_new;
  process.sections[0].items[1] = {};
  process.sections[0].items[1].name = type.process_kai_gong_item_sgxcl;
  process.sections[0].items[1].status = type.process_item_status_new;
  process.sections[0].items[2] = {};
  process.sections[0].items[2].name = type.process_kai_gong_item_mdbcl;
  process.sections[0].items[2].status = type.process_item_status_new;
  process.sections[0].items[3] = {};
  process.sections[0].items[3].name = type.process_kai_gong_item_cgdyccl;
  process.sections[0].items[3].status = type.process_item_status_new;
  process.sections[0].items[4] = {};
  process.sections[0].items[4].name = type.process_kai_gong_item_qdzmjcl;
  process.sections[0].items[4].status = type.process_item_status_new;
  process.sections[0].items[5] = {};
  process.sections[0].items[5].name = type.process_kai_gong_item_kgmbslcl;
  process.sections[0].items[5].status = type.process_item_status_new;

  process.sections[1] = {}
  process.sections[1].name = type.process_section_chai_gai;
  process.sections[1].status = type.process_item_status_new;
  process.sections[1].items = [];
  process.sections[1].items[0] = {};
  process.sections[1].items[0].name = type.process_chai_gai_item_cpbh;
  process.sections[1].items[0].status = type.process_item_status_new;
  process.sections[1].items[1] = {};
  process.sections[1].items[1].name = type.process_chai_gai_item_ztcg;
  process.sections[1].items[1].status = type.process_item_status_new;
  process.sections[1].items[2] = {};
  process.sections[1].items[2].name = type.process_chai_gai_item_qpcc;
  process.sections[1].items[2].status = type.process_item_status_new;


  process.sections[2] = {}
  process.sections[2].name = type.process_section_shui_dian;
  process.sections[2].status = type.process_item_status_new;
  process.sections[2].items = [];
  process.sections[2].items[0] = {};
  process.sections[2].items[0].name = type.process_shui_dian_item_sdsg;
  process.sections[2].items[0].status = type.process_item_status_new;
  process.sections[2].items[1] = {};
  process.sections[2].items[1].name = type.process_shui_dian_item_ntsg;
  process.sections[2].items[1].status = type.process_item_status_new;
  process.sections[2].ys = {};
  process.sections[2].ys.images = [];

  process.sections[3] = {}
  process.sections[3].name = type.process_section_ni_mu;
  process.sections[3].status = type.process_item_status_new;
  process.sections[3].items = [];
  process.sections[3].items[0] = {};
  process.sections[3].items[0].name = type.process_ni_mu_item_dmzp;
  process.sections[3].items[0].status = type.process_item_status_new;
  process.sections[3].items[1] = {};
  process.sections[3].items[1].name = type.process_ni_mu_item_ddsg;
  process.sections[3].items[1].status = type.process_item_status_new;
  process.sections[3].items[2] = {};
  process.sections[3].items[2].name = type.process_ni_mu_item_gtsg;
  process.sections[3].items[2].status = type.process_item_status_new;
  process.sections[3].items[3] = {};
  process.sections[3].items[3].name = type.process_ni_mu_item_sgxaz;
  process.sections[3].items[3].status = type.process_item_status_new;
  process.sections[3].items[4] = {};
  process.sections[3].items[4].name = type.process_ni_mu_item_cwqfssg;
  process.sections[3].items[4].status = type.process_item_status_new;
  process.sections[3].items[5] = {};
  process.sections[3].items[5].name = type.process_ni_mu_item_cwqdzsg;
  process.sections[3].items[5].status = type.process_item_status_new;
  process.sections[3].items[6] = {};
  process.sections[3].items[6].name = type.process_ni_mu_item_ktytzsg;
  process.sections[3].items[6].status = type.process_item_status_new;
  process.sections[3].ys = {};
  process.sections[3].ys.images = [];

  process.sections[4] = {}
  process.sections[4].name = type.process_section_you_qi;
  process.sections[4].status = type.process_item_status_new;
  process.sections[4].items = [];
  process.sections[4].items[0] = {};
  process.sections[4].items[0].name = type.process_you_qi_item_mqqsg;
  process.sections[4].items[0].status = type.process_item_status_new;
  process.sections[4].items[1] = {};
  process.sections[4].items[1].name = type.process_you_qi_item_qmjccl;
  process.sections[4].items[1].status = type.process_item_status_new;
  process.sections[4].ys = {};
  process.sections[4].ys.images = [];

  process.sections[5] = {}
  process.sections[5].name = type.process_section_an_zhuang;
  process.sections[5].status = type.process_item_status_new;
  process.sections[5].items = [];
  process.sections[5].items[0] = {};
  process.sections[5].items[0].name = type.process_an_zhuang_item_mdbmmaz;
  process.sections[5].items[0].status = type.process_item_status_new;
  process.sections[5].items[1] = {};
  process.sections[5].items[1].name = type.process_an_zhuang_item_cgscaz;
  process.sections[5].items[1].status = type.process_item_status_new;
  process.sections[5].items[2] = {};
  process.sections[5].items[2].name = type.process_an_zhuang_item_mbdjaz;
  process.sections[5].items[2].status = type.process_item_status_new;
  process.sections[5].items[3] = {};
  process.sections[5].items[3].name = type.process_an_zhuang_item_yjzjaz;
  process.sections[5].items[3].status = type.process_item_status_new;
  process.sections[5].items[4] = {};
  process.sections[5].items[4].name = type.process_an_zhuang_item_scaz;
  process.sections[5].items[4].status = type.process_item_status_new;
  process.sections[5].items[5] = {};
  process.sections[5].items[5].name = type.process_an_zhuang_item_cwddaz;
  process.sections[5].items[5].status = type.process_item_status_new;
  process.sections[5].items[6] = {};
  process.sections[5].items[6].name = type.process_an_zhuang_item_qzpt;
  process.sections[5].items[6].status = type.process_item_status_new;
  process.sections[5].items[7] = {};
  process.sections[5].items[7].name = type.process_an_zhuang_item_snzl;
  process.sections[5].items[7].status = type.process_item_status_new;
  process.sections[5].items[8] = {};
  process.sections[5].items[8].name = type.process_an_zhuang_item_jjaz;
  process.sections[5].items[8].status = type.process_item_status_new;
  process.sections[5].items[9] = {};
  process.sections[5].items[9].name = type.process_an_zhuang_item_wjaz;
  process.sections[5].items[9].status = type.process_item_status_new;
  process.sections[5].ys = {};
  process.sections[5].ys.images = [];

  process.sections[6] = {}
  process.sections[6].name = type.process_section_jun_gong;
  process.sections[6].status = type.process_item_status_new;
  process.sections[6].ys = {};
  process.sections[6].ys.images = [];

  var f = process.duration / config.duration_60;

  process.sections[0].start_at = process.start_at;
  process.sections[0].end_at = DateUtil.add(process.sections[0].start_at,
    config.duration_60_kai_gong, f);

  process.sections[1].start_at = process.sections[0].end_at;
  process.sections[1].end_at = DateUtil.add(process.sections[1].start_at,
    config.duration_60_chai_gai, f);

  process.sections[2].start_at = process.sections[1].end_at;
  process.sections[2].end_at = DateUtil.add(process.sections[2].start_at,
    config.duration_60_shui_dian, f);

  process.sections[3].start_at = process.sections[2].end_at;
  process.sections[3].end_at = DateUtil.add(process.sections[3].start_at,
    config.duration_60_ni_mu, f);

  process.sections[4].start_at = process.sections[3].end_at;
  process.sections[4].end_at = DateUtil.add(process.sections[4].start_at,
    config.duration_60_you_qi, f);

  process.sections[5].start_at = process.sections[4].end_at;
  process.sections[5].end_at = DateUtil.add(process.sections[5].start_at,
    config.duration_60_an_zhuang, f);

  process.sections[6].start_at = process.sections[5].end_at;
  process.sections[6].end_at = DateUtil.add(process.sections[6].start_at,
    config.duration_60_jun_gong, f);

  Process.newAndSave(process, function (err, process_indb) {
    if (err) {
      return next(err);
    }

    res.sendData(process_indb);
  });
}

exports.addComment = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var content = tools.trim(req.body.content);
  var _id = req.body._id;
  var userid = ApiUtil.getUserid(req);

  Process.addComment(_id, section, item, content, userid, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.addImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var imageid = new ObjectId(req.body.imageid);
  var _id = req.body._id;

  Process.addImage(_id, section, item, imageid, function (err) {
    if (err) {
      return next(err);
    }

    Process.updateStatus(_id, section, item, type.process_item_status_going,
      function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
  });
};

exports.addYsImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var key = tools.trim(req.body.key);
  var imageid = new ObjectId(req.body.imageid);
  var _id = req.body._id;

  Process.updateYsImage(_id, section, key, imageid, function (err,
    process) {
    if (err) {
      return next(err);
    }

    if (process) {
      res.sendSuccessMsg();
    } else {
      //没有更新的 创建新的
      Process.addYsImage(_id, section, key, imageid, function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
    }
  });
}

exports.deleteYsImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var key = tools.trim(req.body.key);
  var _id = req.body._id;

  Process.updateYsImage(_id, section, key, null, function (err, process) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

function buildMessage(usertype, user, designer, reschedule, msg) {
  var id = '';
  var name = '';
  if (usertype === type.role_user) {
    name = user.username || user.phone;
    name = '业主' + name;
    id = designer._id;
  } else if (usertype === type.role_designer) {
    name = designer.username || designer.phone;
    name = '设计师' + name;
    id = user._id;
  }
  // var content = name + '向您提出了一个延期提醒, 希望可以延期到' + DateUtil.YYYY_MM_DD(
  // reschedule.new_date);
  var content = name + msg + DateUtil.YYYY_MM_DD(reschedule.new_date);

  return {
    id: id,
    content: content
  };
}

exports.reschedule = function (req, res, next) {
  var reschedule = ApiUtil.buildReschedule(req);
  var usertype = ApiUtil.getUsertype(req);
  reschedule.request_role = usertype;
  reschedule.status = type.process_item_status_reschedule_req_new;
  var ep = eventproxy();

  ep.fail(next);
  ep.on('sendMessage', function () {
    User.getUserById(reschedule.userid, function (err, user) {
      if (err) {
        return next(err);
      }

      Designer.getDesignerById(reschedule.designerid, function (err,
        designer) {
        if (err) {
          return next(err);
        }

        var json = buildMessage(usertype, user, designer,
          reschedule, '向您提出了改期, 希望可以将验收改期到');
        // gt.pushMessageToSingle(json.id, {
        //   content: json.content,
        //   type: type.message_type_reschedule,
        // });
        console.log(json.content);
        gt.pushMessageToSingle('55dee46f75e6aa64c0c9378d', {
          content: json.content,
          type: type.message_type_reschedule,
        });
      });
    });
  });

  Reschedule.newAndSave(reschedule, function (err, reschedule) {
    if (err) {
      return next(err);
    }

    if (reschedule) {
      Process.updateStatus(reschedule.processid, reschedule.section, null,
        reschedule.status,
        function (err) {
          if (err) {
            return next(err);
          }

          res.sendSuccessMsg();
          ep.emit('sendMessage');
        });
    } else {
      res.sendErrMsg('无法保存成功');
    }
  });


};

exports.listReschdule = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var query = {};

  if (usertype === type.role_user) {
    query.userid = userid;
  } else if (usertype === type.role_designer) {
    query.designerid = userid;
  }

  Reschedule.findByQueryAndProjectAndOption(query, {}, {}, function (err,
    reschedules) {
    if (err) {
      return next(err);
    }

    res.sendData(reschedules);
  });
}

exports.okReschedule = function (req, res, next) {
  var usertype = ApiUtil.getUsertype(req);
  var query = {};
  var userid = ApiUtil.getUserid(req);
  query.processid = req.body.processid;
  var ep = eventproxy();

  ep.fail(next);
  ep.on('sendMessage', function (reschedule) {
    User.getUserById(reschedule.userid, function (err, user) {
      if (err) {
        return next(err);
      }

      Designer.getDesignerById(reschedule.designerid, function (err,
        designer) {
        if (err) {
          return next(err);
        }

        var json = buildMessage(usertype, user, designer,
          reschedule, '同意了您的改期, 验收将改期到');
        // gt.pushMessageToSingle(json.id, {
        //   content: json.content,
        //   type: type.message_type_reschedule,
        // });
        console.log(json.content);
        gt.pushMessageToSingle('55dee46f75e6aa64c0c9378d', {
          content: json.content,
          type: type.message_type_reschedule,
        });
      });
    });
  });

  if (usertype === type.role_user) {
    query.userid = userid;
  } else if (usertype === type.role_designer) {
    query.designerid = userid;
  }

  Reschedule.updateOneByQueryAndOption(query, {
    status: type.process_item_status_reschedule_ok
  }, {
    sort: {
      request_date: -1,
    }
  }, function (err, reschedule) {
    if (err) {
      return next(err);
    }

    if (!reschedule) {
      return res.sendErrMsg('改期不存在');
    }

    var newDate = reschedule.new_date;
    var index = _.indexOf(type.process_work_flow, reschedule.section);
    Process.getProcessById(reschedule.processid, function (err, process) {
      if (err) {
        return next(err);
      }

      if (process) {
        if (process.sections[index].start_at >= newDate) {
          res.sendErrMsg('无法改期到比开始还早');
        } else {
          var diff = newDate - process.sections[index].end_at;
          process.sections[index].end_at = newDate;
          for (var i = index + 1; i < process.sections.length; i++) {
            process.sections[i].start_at += diff;
            process.sections[i].end_at += diff;
          }

          process.save(function (err) {
            if (err) {
              return next(err);
            }

            res.sendSuccessMsg();
            ep.emit('sendMessage', reschedule)
          });
        }
      } else {
        res.sendErrMsg('工地不存在');
      }
    });
  });
}

exports.rejectReschedule = function (req, res, next) {
  var usertype = ApiUtil.getUsertype(req);
  var query = {};
  var userid = ApiUtil.getUserid(req);
  query.processid = req.body.processid;
  var ep = eventproxy();

  ep.fail(next);
  ep.on('sendMessage', function (reschedule) {
    User.getUserById(reschedule.userid, function (err, user) {
      if (err) {
        return next(err);
      }

      Designer.getDesignerById(reschedule.designerid, function (err,
        designer) {
        if (err) {
          return next(err);
        }

        var json = buildMessage(usertype, user, designer,
          reschedule, '拒绝了您的改期, 无法改期到');
        // gt.pushMessageToSingle(json.id, {
        //   content: json.content,
        //   type: type.message_type_reschedule,
        // });
        console.log(json.content);
        gt.pushMessageToSingle('55dee46f75e6aa64c0c9378d', {
          content: json.content,
          type: type.message_type_reschedule,
        });
      });
    });
  });

  if (usertype === type.role_user) {
    query.userid = userid;
  } else if (usertype === type.role_designer) {
    query.designerid = userid;
  }

  Reschedule.updateOneByQueryAndOption(query, {
    status: type.process_item_status_reschedule_reject
  }, {
    sort: {
      request_date: -1,
    },
  }, function (err, reschedule) {
    if (err) {
      return next(err);
    }

    if (!reschedule) {
      return res.sendErrMsg('改期不存在');
    }

    Process.updateStatus(query.processid, reschedule.section, null, type.process_item_status_reschedule_reject,
      function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
        ep.emit('sendMessage', reschedule);
      });
  });
}

exports.doneItem = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var _id = req.body._id;

  if (!item) {
    return res.sendErrMsg('item 不能空')
  }

  //TODO start next section
  Process.updateStatus(_id, section, item, type.process_item_status_done,
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
};

exports.doneSection = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var _id = req.body._id;

  Process.updateStatus(_id, section, null, type.process_item_status_done,
    function (err) {
      if (err) {
        return next(err);
      }

      //开启下个流程
      var index = _.indexOf(type.process_work_flow, section);
      var next = type.process_work_flow[index + 1];
      if (next) {
        Process.updateStatus(_id, next, null, type.process_item_status_going,
          function (err) {
            if (err) {
              return next(err);
            }

            res.sendSuccessMsg()
          });
      } else {
        res.sendSuccessMsg();
      }
    });
};

exports.getOne = function (req, res, next) {
  var _id = req.params._id;

  Process.getProcessById(_id, function (err, process) {
    if (err) {
      return next(err);
    }

    res.sendData(process);
  });
}

exports.userGetOne = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Process.getProcessByUserid(userid, function (err, process) {
    if (err) {
      return next(err);
    }

    res.sendData(process);
  });
}

exports.listForDesigner = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('processes', function (processes) {
    async.mapLimit(processes, 3, function (process, callback) {
      User.getOneByQueryAndProject({
        _id: process.userid
      }, {
        username: 1,
        imageid: 1,
        phone: 1,
      }, function (err, user) {
        process.user = user;
        callback(err, process);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData(results);
    });
  });

  Process.getSByQueryAndProject({
    final_designerid: designerid
  }, {
    userid: 1,
    city: 1,
    district: 1,
    cell: 1,
    going_on: 1,
  }, function (err, processes) {
    if (err) {
      return next(err);
    }

    var ps = _.map(processes, function (process) {
      return process.toObject();
    });

    ep.emit('processes', ps);
  });

}
