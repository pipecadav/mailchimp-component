'use strict';
describe('Subscribe action', function () {

    const nock = require('nock');
    const action = require('../../lib/actions/subscribe');

    const memberPutReply = require('../data/memberPutReply.json');

    let self;

    beforeEach(function () {
        self = jasmine.createSpyObj('self', ['emit']);
    });

    it('should emit (data and end events on success create request - case: http 200', function () {
        nock('https://us5.api.mailchimp.com', {"encodedQueryParams": true})
            .put('/3.0//lists/listID/members/f3ada405ce890b6f8204094deb12d8a8',
                {
                    "id": "listID",
                    "email_address": "foo@bar.com",
                    "status": "subscribed",
                    "merge_fields": {
                        "EMAIL": "foo@bar.com", 
                        "FNAME": "Renat",
                        "LNAME": "Zubairov",
                        "SALUTATION": "MR",
                        "OPTIN_IP": "192.168.1.1",
                        "OPTIN_TIME": /20/, 
                        "MC_LANGUAGE": "en",
                        "MC_NOTES": "Notes"
                    },
                    "email_type": "html",
                    "ip_opt": "192.168.1.1",
                }).reply(200, memberPutReply);

        runs(function () {
            action.process.call(self, {
                body: {
                    email: 'foo@bar.com',
                    firstName: 'Renat',
                    lastName: 'Zubairov',
                    salutation: 'MR',
                    optInIP: '192.168.1.1',
                    notes: 'Notes'
                }
            }, {
                listId: 'listID',
                apiKey: 'apiKey-us5'
            }, {});
        });

        waitsFor(function () {
            return self.emit.calls.length;
        });

        runs(function () {
            let calls = self.emit.calls;
            expect(calls.length).toEqual(2);
            expect(calls[0].args[0]).toEqual('data');
            expect(calls[0].args[1].body.id).toEqual('20dbbf20d91106a9377bb671ba83f381');
            expect(calls[1].args[0]).toEqual('end');
        });
    });

});