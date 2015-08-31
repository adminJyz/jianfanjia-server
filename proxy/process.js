var models = require('../models');
var Process = models.Process;
var type = require('../type');
var _ = require('lodash');

exports.newAndSave = function (json, callback) {
  var process = new Process(json);
  process.save(callback);
};

exports.addImage = function (id, section, item, imageid, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.items.name';
  var query = {};
  query._id = id;
  query[path] = item;
  path = 'sections.' + index + '.items.$.images';
  var update = {};
  update[path] = imageid;

  Process.findOneAndUpdate(query, {
    $push: update
  }, callback);
};

exports.addYsImage = function (id, section, key, imageid, callback) {
  var update = {};
  update['sections.$.ys.images'] = {
    key: key,
    imageid: imageid
  };

  Process.findOneAndUpdate({
    _id: id,
    'sections.name': section
  }, {
    $push: update
  }, callback);
}

exports.updateYsImage = function (id, section, key, imageid, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.ys.images.key'
  var query = {};
  query._id = id;
  query[path] = key;

  var update = {};
  path = 'sections.' + index + '.ys.images.$.imageid'
  update[path] = imageid;
  Process.findOneAndUpdate(query, {
    $set: update
  }, callback);
}

exports.deleteYsImage = function (id, section, key, callback) {
  var query = {};
  var path = section + '.ys.images.key';
  query._id = id;
  query[path] = key;
  var update = {};
  path = section + '.ys.images.$.imageid'
  update[path] = null;

  Process.findOneAndUpdate(query, {
    $set: update
  }, callback);
}

exports.addComment = function (id, section, item, content, by, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.items.name';
  var query = {};
  query[path] = item;
  query._id = id;
  path = 'sections.' + index + '.items.$.comments';
  var update = {};
  update[path] = {
    by: by,
    content: content,
    date: new Date().getTime(),
  };

  Process.findOneAndUpdate(query, {
    $push: update
  }, callback);
};

exports.getOneById = function (id, callback) {
  Process.findOne({
    _id: id,
  }, callback);
}

exports.updateStatus = function (id, section, item, status, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var query = {};
  var update = {};

  if (item) {
    var path = 'sections.' + index + '.items.name';
    query[path] = item;
    query._id = id;

    path = 'sections.' + index + '.items.$.status';
    update[path] = status;
  } else {
    query._id = id;

    var path = 'sections.' + index + '.status';
    update[path] = status;
  }

  Process.findOneAndUpdate(query, {
    $set: update
  }, callback);
}

exports.getProcessById = function (id, callback) {
  Process.findOne({
    _id: id
  }, callback);
}

exports.getProcessByUserid = function (userid, callback) {
  Process.findOne({
    userid: userid
  }, callback);
}

exports.getSByQueryAndProject = function (query, project, callback) {
  Process.find(query, project, callback);
}
