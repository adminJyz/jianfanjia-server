var models  = require('../models');
var Designer    = models.Designer;
var uuid    = require('node-uuid');

exports.getUserById = function (id, callback) {
  Designer.findOne({_id: id}, callback);
};

exports.getDesignerByPhone = function (phone, callback) {
  Designer.findOne({'phone': phone}, callback);
};

exports.newAndSave = function (json, callback) {
  var designer         = new Designer(json);
  designer.accessToken = uuid.v4();

  designer.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  Designer.update(query, {$set: json}, callback);
};

exports.findDesignersByCityDistrictHalf = function (city, district, price_perm, limit, callback) {
  Designer.find({
    auth_type: '3',
    city: city,
    dec_districts: district,
    dec_fee_half: {'$lte': price_perm}
  }, null, {sort: {score: -1}, limit:3}, callback);
};

exports.findDesignersByCityDistrictAll = function (city, district, price_perm, limit, callback) {
  Designer.find({
    auth_type: '3',
    city: city,
    dec_districts: district,
    dec_fee_all: {'$lte': price_perm}
  }, null, {sort: {score: -1}, limit:3}, callback);
};

exports.findDesignersByCityDistrict = function (city, district, limit, callback) {
  Designer.find({
    auth_type: '3',
    city: city,
    dec_districts: district,
  }, null, {sort: {score: -1}, limit:3}, callback);
};

exports.addViewCountForDesigner = function (desingerid) {
  Designer.update({_id:desingerid}, {'$inc': {'view_count': 1}}, function (err) {});
};

exports.findDesignersOrderByScore = function (limit, callback) {
  Designer.find(
    {auth_type: '3'},
    {'pass': 0},
    {sort: {score: -1}, limit:limit},
    callback
  );
};
