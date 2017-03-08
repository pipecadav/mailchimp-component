'use strict';
describe('Unsubscribe action', function () {

    const nock = require('nock');
    const action = require('../../lib/actions/unsubscribe');

    let self;

    beforeEach(function () {
        self = jasmine.createSpyObj('self', ['emit']);
    });

    it('should emit (data and end events on success create request - case: http 200', function () {
        nock('https://us5.api.mailchimp.com:443', {"encodedQueryParams":true})
            .delete('/3.0//lists/listID/members/f3ada405ce890b6f8204094deb12d8a8').reply(204);

        runs(function () {
            action.process.call(self, {
                body: {
                    email: 'foo@bar.com',
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
            expect(calls[0].args[1].body).toEqual({});
            expect(calls[1].args[0]).toEqual('end');
        });
    });

});