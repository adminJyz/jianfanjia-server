var config = require('../apiconfig');
var Agenda = require('agenda');
var Plan = require('../proxy').Plan;
var type = require('../type');
var request = require('superagent');
var cache = require('../common/cache');
var logger = require('./logger');

var agenda = new Agenda({
  db: {
    address: config.db
  },
  processEvery: '1 minute',
  defaultConcurrency: 1,
  maxConcurrency: 1,
});

agenda.define('expire_designer_respond', function (job, done) {
  var now = new Date().getTime()
  var time = now - (config.designer_respond_user_order_expired * 60 * 1000);

  Plan.update({
    status: type.plan_status_not_respond,
    request_date: {
      $lt: time
    },
  }, {
    status: type.plan_status_designer_no_respond_expired,
    last_status_update_time: now,
  }, function (err, count) {
    logger.info('expire designer respond err: ' + err + ' count: ' +
      JSON.stringify(count));
    done();
  });
});

agenda.define('expire_designer_upload_plan', function (job, done) {
  var now = new Date().getTime()
  var time = now - (config.designer_upload_plan_expired * 60 * 1000);

  Plan.update({
    status: type.plan_status_designer_housecheck_no_plan,
    last_status_update_time: {
      $lt: time
    },
  }, {
    status: type.plan_status_designer_no_plan_expired,
    last_status_update_time: now,
  }, function (err, count) {
    logger.info('expire designer upload plan err: ' + err +
      ' count: ' + JSON.stringify(count));
    done();
  });
});

agenda.define('get_wechat_token', function (job, done) {
  request.get('https://api.weixin.qq.com/cgi-bin/token').query({
    grant_type: 'client_credential',
    appid: config.wechat_appid,
    secret: config.wechat_app_Secret,
  }).end(function (err, res) {
    if (res.ok) {
      logger.info(res.body);
      cache.set(type.wechat_token, res.body.access_token, 60 * 60 * 2)
      done();
    } else {
      logger.info('err = ' + res.text);
      done();
    }
  });
});

agenda.on('ready', function () {
  // agenda.every(config.interval_scan_expired_respond + ' minutes',
  //   'expire_designer_respond');
  agenda.every(config.interval_scan_expired_upload_plan + ' minutes',
    'expire_designer_upload_plan');

  if (config.open_weixin_token) {
    agenda.every(config.interval_get_wechat_token + ' minutes',
      'get_wechat_token');
  }

  agenda.start();
});

// exports.module = agenda;
