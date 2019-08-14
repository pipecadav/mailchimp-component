'use strict';
const co = require('co');
const mailchimp = require('mailchimp-v3');

exports.getLists = getLists;
exports.getStores = getStores;

/**
 * Function that returns values for the list selection box
 *
 * @param conf
 * @param cb
 */
function getLists(conf, cb) {
    co(function*() {
        console.log('Fetching lists');

        mailchimp.setApiKey(conf.apiKey);
        const lists = yield mailchimp
            .get('lists/?count=100');
        let result = {};
        lists.lists.map((list) => {
            result[list.id] = list.name
        });
        console.log('Result ', result);
        cb(null, result);
    }).catch(err => {
        console.log('Error occurred', err.stack || err);
        cb(err);
    });
}



/**
 * Function that returns stores from e-commerce API
 *
 * @param conf
 * @param cb
 */
function getStores(conf, cb) {
    co(function*() {
        console.log('Fetching stores');

        mailchimp.setApiKey(conf.apiKey);
        const lists = yield mailchimp
            .get('ecommerce/stores');
        let result = {};
        lists.stores.map((store) => {
            result[store.id] = store.name
        });
        console.log('Result ', result);
        cb(null, result);
    }).catch(err => {
        console.log('Error occurred', err.stack || err);
        cb(err);
    });
}

