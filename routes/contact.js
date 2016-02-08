var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var recipient = 'jdukes22@gmail.com';

var auth = {
    auth: {
        api_key: 'key-39931881223cd1a91919357529a7ebfb',
        domain: 'mg.jacquesdukes.com'
    }
};

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

/* GET users listing. */
router.post('/', function (req, res, next) {
    var formData = req.body;
    nodemailerMailgun.sendMail({
            from: formData.name + ' <' + formData.email + '>',
            to: recipient, // An array if you have multiple recipients.
            subject: formData.subject,
            text: formData.message
        })
        .then(function (info) {
            res.status(200).json({
                status: 200,
                result: 'success'
            });
        })
        .catch(function (err) {
            console.log("Error sending email: " + err);
            res.status(500).json({
                status: 500,
                result: 'failure'
            });
        });
});

module.exports = router;
