
/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index');
};

exports.contact = require('./contact.js').contact;