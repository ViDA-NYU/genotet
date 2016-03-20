/**
 * @fileoverview user function handler
 */
var fs = require('fs');
var assert = require('assert');

var log = require('./log.js');
var utils = require('./utils.js');

/** @type {user} */
module.exports = user;

/**
 * @constructor
 */
function user() {}

/** @enum {string} */
user.QueryType = {
  SIGNUP: 'sign-up',
  SIGNIN: 'sign-in'
};

/**
 * Name of user information file.
 * @type {string}
 */
user.userInfoFile = 'userInfo.txt';

/**
 * Expire time of cookie.
 * @const {number}
 */
user.cookieExpireTime = 24 * 60 * 60 * 1000;

/**
 * @typedef {{
 *   email: (string|undefined),
 *   username: string,
 *   password: string,
 *   confirmed: (boolean|undefined)
 * }}
 */
user.Info;

/**
 * @typedef {{
 *   error: string
 * }}
 */
user.Error;

/**
 * Checks the user information for signing in.
 * @param {!mongodb.Db} db Session database.
 * @param {string} userPath Directory of user information file.
 * @param {!user.Info} userInfo User Information
 * @param {function(!Object)} callback Callback function.
 */
user.signUp = function(db, userPath, userInfo, callback) {
  var checkDuplicate = {
    duplicated: false,
    elements: []
  };
  var cursor = db.collection('userInfo').find({
    $or: [{username: userInfo.username}, {email: userInfo.email}]});
  var data = [];
  cursor.each(function(err, doc) {
    assert.equal(err, null, 'error occurs');
    if (doc != null) {
      data.push(doc);
    } else {
      var result = authenticateCallback();
      callback(result);
    }
  });
  var authenticateCallback = function() {
    if (data.length) {
      checkDuplicate.duplicated = true;
      console.log(data);
      data.forEach(function(item) {
        console.log(item);
        if (item.email == userInfo.email) {
          checkDuplicate.elements.push('email: ' + userInfo.email);
        }
        if (item.username == userInfo.username) {
          checkDuplicate.elements.push('username: ' + userInfo.username);
        }
      });
    }
    if (checkDuplicate.duplicated) {
      var errorMessage = checkDuplicate.elements.join(' and ') + ' exist';
      errorMessage += checkDuplicate.elements.length == 1 ? 's' : '';
      return {
        error: errorMessage
      };
    } else {
      db.collection('userInfo').insertOne(userInfo);
      log.serverLog('user information saved');
      var folder = userPath + userInfo.username + '/';
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
      return true;
    }
  };
};

/**
 * Checks the user information for signing in.
 * @param {!mongodb.Db} db Session database.
 * @param {!user.Info} userInfo User Information
 * @param {function(!Object)} callback Callback function.
 */
user.signIn = function(db, userInfo, callback) {
  var cursor = db.collection('userInfo').find({username: userInfo.username});
  var data;
  cursor.each(function(err, doc) {
    assert.equal(err, null, 'error occurs');
    if (doc != null) {
      data = doc;
    } else {
      var result = authenticateCallback();
      callback(result);
    }
  });
  var authenticateCallback = function() {
    if (data && data.password == userInfo.password) {
      return true;
    } else {
      return {
        error: 'invalid username or password'
      };
    }
  };
};

/**
 * Gets session ID from database. Regenerate if it is expired.
 * @param {!mongodb.Db} db Session database.
 * @param {string} username Username of the POST query.
 * @param {function(!Object)} callback Callback function.
 */
user.authenticate = function(db, username, callback) {
  var cursor = db.collection('session').find({username: username});
  var result = [];
  cursor.each(function(err, doc) {
    assert.equal(err, null, 'error occurs');
    if (doc != null) {
      result.push(doc);
    } else {
      var data = authenticateCallback();
      callback(data);
    }
  });
  var authenticateCallback = function() {
    var hasValidSession = false;
    var sessionIndex = -1;
    if (result.length) {
      for (var i = 0; i < result.length; i++) {
        if (new Date().getTime() < result[i].expiration) {
          sessionIndex = i;
          hasValidSession = true;
          break;
        }
      }
    }
    if (!result.length || !hasValidSession) {
      // Don't have username or have username but don't have valid session
      var cookie = {
        username: username,
        sessionId: utils.randomString(),
        expiration: new Date().getTime() + user.cookieExpireTime
      };
      db.collection('session').insertOne(cookie);
    } else {
      // Have session and update expire date
      var cookie = result[sessionIndex];
      var newExpiration = new Date().getTime() + user.cookieExpireTime;
      db.collection('session').update(cookie,
        {$set: {expiration: newExpiration}}, {upsert: false});
      cookie.expiration = newExpiration;
    }
    return {
      cookie: cookie
    };
  };
};