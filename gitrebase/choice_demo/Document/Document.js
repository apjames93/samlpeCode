'use strict';

var S = require('underscore.string');
var _ = require('underscore');
var crypto = require('crypto');
var fs = require('fs');
var loopback = require('loopback');
var path = require('path');
var pdfRenderer = require('../../utils/pdf_renderer.js');
var s3Client = require('../../utils/s3_client.js');
var secureToken = require('../../utils/secure_token.js');
var templateEngine = require('../../utils/template_engine.js');
var FROM = '"WoodRiver Energy LLC" <noreply@woodriverenergy.com>';
var TO = 'choice@woodriverenergy.com';

module.exports = function(Document) {
  /**
   * Inject token based IDs using secure random 48 byte, url/file safe strings.
   * All bindings marked 'creatorsResponsibility' MUST be set or the create will
   * fail.
   */
  Document.observe('before save', (ctx, next) => {
    // TODO(athilenius): Moar (yes, spelled like that) error handling.
    if (!ctx.isNewInstance) {
      // Ignore non-new instances
      return next();
    }
    if (!ctx.instance.documentTemplateId) {
      // Shouldn't be possible wth ACL, but be safe.
      return next(new Error('Missing document template'));
    }
    // Lookup the template
    Document.app.models.DocumentTemplate
      // Lookup the DocumentTemplate
      .findById(ctx.instance.documentTemplateId)
      .then(template => {
        // Set closures
        ctx.instance.templateEngine = template.templateEngine;
        ctx.instance.templateClosure = template.template;
        // Check inital values of the document, making sure that all
        // 'creatorsResponsibility' values are filled out.
        if (!templateEngine.wrap(ctx.instance)
          .sanitizeAndCheckInitialValues()) {
          return next(new Error('Missing initial values. All ' +
            'creatorsResponsibility bindings must be set!'));
        }
        // Generate a secure token to use as an ID
        return secureToken();
      }, err => next(new Error('404 Template ID')))
      .then(token => {
        try {
          // Set the rest of the fields we care about and continue
          ctx.instance.id = token;
          ctx.instance.name = S.isBlank(ctx.instance.name) ? 'Unnamed' :
          ctx.instance.name;
          ctx.instance.finalized = false;
          next();
        } catch (e) {
          console.log(e);
        }
      });
  });

  /**
   * Adds values to the document. Any values already set cannot be changed.
   * signatures are ignored. Returns true if ready to sign.
   */
  Document.prototype.addValues = function(values, next) {
    if (this.finalized) {
      return next(new Error('Finalized documents cannot be edited!'));
    }
    var wrappedDoc = templateEngine.wrap(this);
    wrappedDoc.addValues(values || {});
    this.save(err => next(null, wrappedDoc.readyForSignature));
  };

  Document.remoteMethod('addValues', {
    accepts: [{
      arg: 'values',
      type: 'object',
      description: 'The values to be immutably added.',
      required: false
    }],
    returns: {
      arg: 'readyForSignature',
      type: 'boolean'
    },
    isStatic: false
  });

  /**
   * Just like addValues except that it only takes signatures and only after ALL
   * fields have been set. Returns true if the document is ready to sign. Can be
   * called without any values to check if the document is ready to sign.
   */

  Document.prototype.sign = function(values, next) {
    var geoLocate;
    // console.log('sign is being hit', values);
    if (this.finalized) {
      return next(new Error('Finalized documents cannot be edited!'));
    }
    // Keep IP address with signature as well
    var loopbackContext = loopback.getCurrentContext();
    var remoteAddress = null;
    if (loopbackContext && loopbackContext.active &&
      loopbackContext.active.request) {
      var request = loopbackContext.active.request;
      remoteAddress = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress;
    }
    Document.app.freeGeoIpCached.get(remoteAddress)
    .then(geoLoc => {
      var wrappedDoc = templateEngine.wrap(this);
      var err = wrappedDoc.sign(values || {}, remoteAddress , geoLoc);
      if (err) {
        return next(err);
      }
      this.save(err => next(null, wrappedDoc.readyForFinalize));
    }, err => next(new Error('Geolocation Failed')));

  };

  Document.remoteMethod('sign', {
    accepts: [{
      arg: 'values',
      type: 'object',
      description: 'The signature values to be immutably added.',
      required: false
    }],
    returns: {
      arg: 'readyForFinalize',
      type: 'boolean'
    },
    isStatic: false
  });

  /**
   * Finalizes the document. This can only be called after all fields have been
   * set including signatures.
   */
  Document.prototype.finalize = function(next) {
    if (this.finalized) {
      return next(new Error('Finalized documents cannot be edited!'));
    }
    var wrappedDoc = templateEngine.wrap(this);
    if (!wrappedDoc.readyForFinalize) {
      return next(new Error('Not all fields have been set!'));
    }
    // Render to PDF, upload to S3
    pdfRenderer.render(this)
      .then(fullPath => {
        // Upload it to S3
        var uploader = s3Client.uploadFile({
          localFile: fullPath,
          s3Params: {
            Bucket: 'woodriver-documents',
            Key: this.id + '/' + this.name + '.pdf',
            ACL: 'public-read'
          },
        });
        uploader.on('error', err => {
          console.log('AWS S3 Error!! ', err);
          next(new Error('Failed to finalize document.'));
        });
        uploader.on('end', () => {
          // Set the document as finalized and save it.
          this.finalized = true;
          this.save();
          Document.email(this.values, this.id);
          Document.customerEmail(this.values, this.id);
          next();
        });
      });
  };

  Document.email = function(customer, docId) {
    var urlName = encodeURIComponent(customer.fullName);
    Document.app.models.Email.send({
      to: TO,
      from: FROM,
      subject: customer.fullName + '  has just signed a' +
      ' black hills energy delegation agreement ' ,
      html: customer.fullName + ' Account number: ' + customer.account +
      '<br> Phone Number :' + customer.phone + '<br>' +
      'Email: ' + customer.emailAddress + '<br>' +
      'URL for the document : <br>' +
      'https://s3-us-west-1.amazonaws.com/woodriver-documents/' + docId + '/' +
      urlName + '.pdf',
    }, err => {
      if (err) {
        console.log(err);
      }
    });
  };

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };

  Document.customerEmail = function(customer, docId) {
    var urlName = encodeURIComponent(customer.fullName);
    var nameStr = customer.fullName.split(' ');
    var firstName = nameStr[0].capitalizeFirstLetter();
    var lastName = nameStr[1].capitalizeFirstLetter();
    Document.app.models.Email.send({
      to: customer.emailAddress,
      from: FROM,
      subject: 'Thank you ' + firstName + ' for picking WoodRiver Energy as' +
      ' your natural gas supplier',
      html: firstName + ' ' + lastName +  ' please click on the link below to' +
      ' view the Black Hills Energy delegation agreement <br>' +
      '<p style="text-align: center;">' +
      '<a href="https://s3-us-west-1.amazonaws.com/woodriver-documents/' +
      docId + '/' + urlName + '.pdf" ' + '>' +
      'Signed delegation agreement </a>  </p> ' +
      '<br> If you have any questions please feel free to contact the' +
      ' WoodRiver team at 1(888) 510-9315 <br>' +
      '<p style="text-align: right;"> ' +
      '<img src ="http://www.iowarestaurantresources.com/images/allied-logos/161.jpg"' +
      ' alt="WoodRiver Energy LLC" height="40"> </p>'
    }, err => {
      if (err) {
        console.log(err);
      }
    });
  };

  Document.remoteMethod('finalize', {
    isStatic: false
  });

  Document.sendCustomerDoc = function(data, cb) {
    Document.agentToCustomerEmail(data.body);
    var response = 'Email was sent to ' + data.body.emailAddress;
    cb(null, response);
  };

  Document.remoteMethod('sendCustomerDoc', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}}
    ],
    returns: {
      arg: 'emailSent',
      type: 'string'
    },
  });

  Document.agentToCustomerEmail = function(data) {
    Document.app.models.Email.send({
      to: data.emailAddress,
      from: FROM,
      subject: 'Hello ' + data.fullName + ' from WoodRiver Energy',
      html: data.data.name +  ' with the WoodRiver team set up a ' +
      'Black Hills Delegation agreement for you to look over' +
      ' please click on the link below to review the document and sign.<br>' +
      '<p style="text-align: center;">' +
      '<a href="http://woodriverenergy.com/document/' +
      data.documentId   + '"' + '>' +
      'Delegation agreement preview </a>  </p> ' +
      'additional information about this Black Hills ' +
      ' Energy delegation agreement is below <br>' +
       '<p>  note: ' + data.data.subject + '<br>' +
      '</p><br> If you have any questions please call ' + data.data.name +
      ' at ' + data.data.agentNumber + '<p style="text-align: right;"> ' +
      '<img src ="http://www.iowarestaurantresources.com/images/allied-logos/161.jpg"' +
      ' alt="WoodRiver Energy LLC" height="40"> </p>'
    }, err => {
      if (err) {
        console.log(err);
      }
    });
  };
};
