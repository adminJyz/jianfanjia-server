var config = require('../apiconfig');
var GeTui = require('./GT.push');
var TransmissionTemplate = require('./template/TransmissionTemplate');
var SingleMessage = require('./message/SingleMessage');
var Target = require('./Target');
var APNPayload = require('./payload/APNPayload');
var SimpleAlertMsg = require('./payload/SimpleAlertMsg');
var RequestError = require('./RequestError');
var type = require('../type');
var logger = require('../common/logger');

var gt_user = new GeTui(config.gt_HOST, config.gt_user_APPKEY, config.gt_user_MASTERSECRET);
var gt_designer = new GeTui(config.gt_HOST, config.gt_designer_APPKEY, config.gt_designer_MASTERSECRET);

function buildAPNAlertMessage(playload) {
  if (playload.type === type.message_type_procurement) {
    return '您即将进入下一轮建材购买阶段，您需要购买的是：' + playload.content;
  } else {
    return playload.content;
  }
}

exports.buildPayloadFromUserMessage = function (user_message) {
  return {
    content: user_message.content,
    type: user_message.message_type,
    time: user_message.create_at,
    messageid: user_message._id,
  };
}

exports.buildPayloadFromDesignerMessage = function (designer_message) {
  return {
    content: designer_message.content,
    type: designer_message.message_type,
    time: designer_message.create_at,
    messageid: designer_message._id,
  };
}

function buildMessage(appid, appkey, playload) {
  var payload = new APNPayload();
  var alertMsg = new SimpleAlertMsg();
  alertMsg.alertMsg = playload.content;
  payload.alertMsg = alertMsg;
  payload.badge = playload.badge;
  payload.contentAvailable = 1;
  payload.category = "ACTION 1";
  // payload.sound = "test1.wav";
  payload.customMsg.payload1 = JSON.stringify(playload);

  var template = new TransmissionTemplate({
    appId: appid,
    appKey: appkey,
    transmissionType: 2,
    transmissionContent: JSON.stringify(playload),
  });
  template.setApnInfo(payload);

  var message = new SingleMessage({
    isOffline: true, //是否离线
    offlineExpireTime: 3600 * 48 * 1000, //离线时间
    data: template, //设置推送消息类型
  });

  logger.debug(playload);
  return message;
}

function buildTarget(appid, userid) {
  userid = userid.toString();
  logger.debug('sending to userid = ' + userid);
  //接收方
  return new Target({
    appId: appid,
    alias: userid,
  });
}

exports.pushMessageToUser = function (userid, playload) {
  logger.debug('send to user');
  var target = buildTarget(config.gt_user_APPID, userid);
  var message = buildMessage(config.gt_user_APPID, config.gt_user_APPKEY, playload);
  gt_user.pushMessageToSingle(message, target, function (err, res) {
    logger.debug('push err = ' + err);
    logger.debug(res);
    if (err != null && err.exception != null && err.exception instanceof RequestError) {
      var requestId = err.exception.requestId;
      logger.debug(err.exception.requestId);
      gt_user.pushMessageToSingle(message, target, requestId, function (
        err, res) {
        logger.debug(err);
        logger.debug(res);
      });
    }
  });
}

exports.pushMessageToDesigner = function (userid, playload) {
  logger.debug('send to designer');
  var target = buildTarget(config.gt_designer_APPID, userid);
  var message = buildMessage(config.gt_designer_APPID, config.gt_designer_APPKEY, playload);
  gt_designer.pushMessageToSingle(message, target, function (err, res) {
    logger.debug('push err = ' + err);
    logger.debug(res);
    if (err != null && err.exception != null && err.exception instanceof RequestError) {
      var requestId = err.exception.requestId;
      logger.debug(err.exception.requestId);
      gt_designer.pushMessageToSingle(message, target, requestId,
        function (err, res) {
          logger.debug(err);
          logger.debug(res);
        });
    }
  });
}
