var assert = require('assert'),
	clients = require('../routes/clients.js');

describe('calling interpolate', function() {
	it('should add zero points where there is a gap', function() {
		var initial = [ 
			{ x: new Date('2013-01-25T11:00:00'), y: 1},
			{ x: new Date('2013-01-25T13:00:00'), y: 1}
		];
		
		var interpolated = clients.interpolate(initial, new Date('2013-01-25T13:00:00'));
		
		var expected = [ 
			{ x: new Date('2013-01-25T11:00:00'), y: 1},
			{ x: new Date('2013-01-25T12:00:00'), y: 0},
			{ x: new Date('2013-01-25T13:00:00'), y: 1}
		];

		assert.deepEqual(interpolated, expected);
	});

	it('should add zero points where there are gaps', function() {
		var initial = [ 
			{ x: new Date('2013-01-25T11:00:00'), y: 1},
			{ x: new Date('2013-01-25T13:00:00'), y: 1},
			{ x: new Date('2013-01-25T19:00:00'), y: 1},
			{ x: new Date('2013-01-26T01:00:00'), y: 1},
			{ x: new Date('2013-01-26T02:00:00'), y: 1}
		];
		
		var interpolated = clients.interpolate(initial, new Date('2013-01-26T04:00:00'));
		var expected = [ 
			{ x: new Date('2013-01-25T11:00:00'), y: 1},
			{ x: new Date('2013-01-25T12:00:00'), y: 0},
			{ x: new Date('2013-01-25T13:00:00'), y: 1},
			{ x: new Date('2013-01-25T14:00:00'), y: 0},
			{ x: new Date('2013-01-25T15:00:00'), y: 0},
			{ x: new Date('2013-01-25T16:00:00'), y: 0},
			{ x: new Date('2013-01-25T17:00:00'), y: 0},
			{ x: new Date('2013-01-25T18:00:00'), y: 0},
			{ x: new Date('2013-01-25T19:00:00'), y: 1},
			{ x: new Date('2013-01-25T20:00:00'), y: 0},
			{ x: new Date('2013-01-25T21:00:00'), y: 0},
			{ x: new Date('2013-01-25T22:00:00'), y: 0},
			{ x: new Date('2013-01-25T23:00:00'), y: 0},
			{ x: new Date('2013-01-26T00:00:00'), y: 0},
			{ x: new Date('2013-01-26T01:00:00'), y: 1},
			{ x: new Date('2013-01-26T02:00:00'), y: 1},
			{ x: new Date('2013-01-26T03:00:00'), y: 0},
			{ x: new Date('2013-01-26T04:00:00'), y: 0}
		];

		assert.deepEqual(interpolated, expected);
	});

	it('should not add zero points where there is no gap', function() {
		var initial = [ 
			{ x: new Date('2013-01-25T11:00:00'), y: 1},
			{ x: new Date('2013-01-25T12:00:00'), y: 1}
		];
		
		var interpolated = clients.interpolate(initial, new Date('2013-01-25T12:00:00'));
		
		assert.deepEqual(interpolated, initial);
	});
});