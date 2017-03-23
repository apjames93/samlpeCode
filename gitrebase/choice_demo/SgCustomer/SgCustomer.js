'use strict';

var Promise = require('bluebird');
var S = require('underscore.string');
var _ = require('underscore');
var roles = require('../../utils/roles.js');

module.exports = function(SgCustomer) {
  var data = {};
  SgCustomer.generateChoicePdf = function(query, next) {
    var sgCustomer = null;
    data = query;
    var findOne = {where: data.where};
    SgCustomer.findOne(findOne)

      // Find the document remplate
      .then(customer => {
        sgCustomer = customer;
        return SgCustomer.app.models.DocumentTemplate.findOne({
          where: {
            id: 3
          }
        });
      }, err => next(err))
      // Create a document, attach it to the agent Person
      .then(documentTemplate => {
        return SgCustomer.app.agent.person.documents.create({
          documentTemplateId: documentTemplate.id,
          name: data.customer.name,
          values: {
            confirmNumber: data.confirmNumber,
            account: data.where.accountNum,
            premiseNum: data.where.premiseNumber,
            billClass: data.billClass,
            programYears: data.progYear,
            serviceState: data.serviceState,
            fullName: data.customer.name,
            address: data.customer.serviceAddress,
            serviceCsz: data.customer.serviceCsz,
            mailingAddress: data.customer.mailingAddress,
            mailingeCsz: data.customer.mailingeCsz,
            emailAddress: data.customer.emailAddress,
            phone: data.customer.phone,
            progType: data.progType,
            term: data.term,
            price: data.price,
            legal: data.legal,
            contractorName: 'Alec Peter',
            note: data.note,
          }
        });
      }, err => next(err))
      .then(doc => next(null, doc.id), err => next(err));
  };

  SgCustomer.remoteMethod('generateChoicePdf', {
    accepts: [{
      arg: 'query',
      type: 'object',
      description: 'The SG Customer query object. Must include one of: ' +
        'accountNum, premiseNum'
    }],
    returns:
    {arg: 'documentId', type: 'string'},
    isStatic: true
  });

  SgCustomer.observe('access', (ctx, next) => {
    if (!ctx.query.where ||
      (!ctx.query.where.customerNum && !ctx.query.where.accountNum)) {
      return next(new Error(
        'An account number or premise number must be given.'));
    }
    next();
  });
};
