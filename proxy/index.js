var factory = require('./factory');

exports.User = require('./user');
exports.Designer = require('./designer');
exports.TempUser = require('./temp_user');
exports.Image = require('./image');
exports.Plan = require('./plan');
exports.Product = require('./product');
exports.Requirement = require('./requirement');
exports.VerifyCode = require('./verify_code');
exports.Share = require('./share');
exports.Favorite = require('./favorite');
exports.Team = require('./team');
exports.Process = require('./process');
exports.Reschedule = require('./reschedule');
exports.ApiStatistic = require('./api_statistic');
exports.Feedback = require('./feedback');
exports.Comment = require('./comment');
exports.Evaluation = require('./evaluation');
exports.Kpi = require('./kpi');
exports.DecStrategy = require('./dec_strategy');
exports.BeautifulImage = require('./beautiful_image');
exports.Answer = require('./answer');
exports.UserMessage = factory.create_proxy(require('../models').UserMessage);
exports.DesignerMessage = factory.create_proxy(require('../models').DesignerMessage);
exports.Supervisor = factory.create_proxy(require('../models').Supervisor);
exports.Diary = factory.create_proxy(require('../models').Diary);
exports.DiarySet = factory.create_proxy(require('../models').DiarySet);
