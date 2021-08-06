import * as request from 'supertest';
import { app } from './../../index';

describe('GET /users', function () {
	it('respond with json containing a list of all users', function (done) {
		request(app)
			.get('/')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});
