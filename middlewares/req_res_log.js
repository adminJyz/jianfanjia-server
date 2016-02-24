var fs = require('fs');
var morgan = require('morgan');
var config = require('../apiconfig');
var path = require('path');
var logger = require('../common/logger');


logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

var logDirectory = path.normalize(__dirname + '/../log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var httpLogger = undefined;
var format =
  ':date[clf] :remote-addr :remote-user :method :req[Content-Type] :req[cookie] :url HTTP/:http-version/:user-agent :status :res[content-length] - :response-time ms';
httpLogger = morgan(format, {
  stream: logger.stream
});

module.exports = httpLogger;
