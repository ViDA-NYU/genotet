/**
 * @fileoverview Server logger.
 */

var dateFormat = require('dateformat');
var fs = require('fs');

/** @type {log} */
module.exports = log;

/**
 * @constructor
 */
function log() {}

/** @const */
log.query = {};

/**
 * @typedef {{
 *   timestamp: number,
 *   content: string
 * }}
 */
log.UserLog;

/**
 * @typedef {{
 *   username: string,
 *   logs: !Array<!log.UserLog>
 * }}
 */
log.query.UserLogList;

/**
 * Prints logs with timestamps.
 * @param {...*} var_args Content to be logged.
 */
log.serverLog = function(var_args) {
  if (!arguments.length) {
    return;
  }
  var date = new Date();
  var content = '[' + dateFormat(date, 'yyyy-mm-dd_HH:MM:ss') + '_' +
    date.getTime() + '] ';
  for (var i = 0; i < arguments.length; i++) {
    content += ' ' + arguments[i];
  }
  console.log(content);
};

/**
 * Prints user activity logs.
 * @param {string} userPath Path to the user folder.
 * @param {!log.query.UserLogList} query Query parameters.
 */
log.userLog = function(userPath, query) {
  var logs = query.logs;
  var username = query.username;
  var folder = userPath + username + '/log/';
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  var date = new Date();
  var logFile = folder + 'log_' + dateFormat(date, 'yyyy-mm-dd_HH') + '.log';
  var fd = fs.openSync(logFile, 'a');
  logs.forEach(function(log) {
    var logString = '';
    date.setMilliseconds(log.timestamp);
    logString += '[' + dateFormat(date, 'yyyy-mm-dd_HH:MM:ss') + '_' +
      log.timestamp + '] ';
    logString += log.content;
    fs.writeSync(fd, logString + '\n');
  });
  fs.closeSync(fd);
};