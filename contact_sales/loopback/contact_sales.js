'use strict';
var Promise = require('bluebird');
var FROM = '"WoodRiver Energy LLC" <noreply@woodriverenergy.com>';
var SUBJECT = 'WoodRiver potential new customer';

module.exports = function(contactSales) {

  contactSales.observe('before save', (newCustomer, next)=> {
    if (newCustomer.isNewInstance) {
      contactSales.sendCustomerEmail(newCustomer.instance);
      contactSales.email(newCustomer.instance);
      return next();
    }
  });
  contactSales.email = function (newCustomer) {
    contactSales.app.models.Email.send({
      to: 'sales@woodriverenergy.com',
      from: FROM,
      subject: SUBJECT,
      html: 'customer name :' + newCustomer.firstName + ' ' + newCustomer.lastName +
       '<br>address : ' + newCustomer.address + ' <br> phone number : ' +
        newCustomer.phoneNumber + ' <br> email : ' + newCustomer.email +
        '<br> allow contact : ' + newCustomer.allowcontact +
        '<br> subject : ' + newCustomer.subject,
    }, err => {
      if (err) {
        console.log(err);
      }
    });
  };

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };

  contactSales.sendCustomerEmail = function(newCustomer) {
    contactSales.app.models.Email.send({
      to: newCustomer.email,
      from: FROM,
      subject: newCustomer.firstName.capitalizeFirstLetter() + ' ' +
      newCustomer.lastName.capitalizeFirstLetter() + ' thank you' +
      ' for contacting WoodRiver Energy',
      html: 'Thanks ' + newCustomer.firstName.capitalizeFirstLetter() + ' ' +
      newCustomer.lastName.capitalizeFirstLetter() +
      ' for reaching out to us! one of our Sales representative ' +
      'will contact you within the next 24 hours.<br> ' +
      '3300 E 1st Ave, Suite 600, Denver, CO 80206 <br>' +
      '720-306-9530 (o),  303-868-9496 (m) <br>' +
      '<p style="text-align: right;"> ' +
      '<img src ="http://www.iowarestaurantresources.com/images/allied-logos/161.jpg" alt="WoodRiver Energy LLC" height="40"> </p>'
    }, err => {
      if (err) {
        console.log(err);
      }
    });
  };
};
