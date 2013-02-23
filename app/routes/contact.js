
/*
 * POST contact form
 */

var Validator = require('validator').Validator,
    nodemailer = require("nodemailer"),
    config = require("../config.js");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: config.contact.sender.email,
        pass: config.contact.sender.password
    }
});


function validate (message) {
  var v = new Validator(),
      errors = {
        byId: {},
        all: []
      },
      currentField;

  v.error = function(msg) {
    errors.byId[currentField] = msg;
    errors.all.push({
      id: currentField,
      message: msg
    });
  };


  currentField = 'name';
  v.check(message.name, 'Please enter your name').len(1, 100);

  currentField = 'phone';

  if (!message.phone && !message.email){
    v.error('Please enter a contact phone number or email address');
  } else if (message.email) {
    currentField = 'email';
    v.check(message.email, 'Please enter a valid email address').isEmail();
  }

  currentField = 'message';
  v.check(message.message, 'Please enter a message').len(1, 2000);

  return errors;
}

function sendEmail (message, cb) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: config.contact.sender.name + ' <' + config.contact.sender.email + '>',
      to: config.contact.receiver,
      subject: "Contact from: " + message.name, // Subject line
      text: message.message
  };
  //cb(true);
  smtpTransport.sendMail(mailOptions, cb);
}


exports.contact = function (req, res) {
  var message = req.body.contact,
      errors = validate(message),
      locals = {
        title: 'Contact',
        message: message
      };

  function render () {
    res.render('contact', locals);
  }

  if (errors.all.length === 0) {
    sendEmail(message, function(err) {
      if (err) {
        locals.error = 'Sorry, there\'s been a problem sending your message. Please use the contact details above instead';
      } else {
        locals.sent = true;
      }
      render();
    });
  } else {
    locals.error = 'Sorry, there\'s a problem with your message';
    locals.errors = errors;
    render();
  }
};