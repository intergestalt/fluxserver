var tilestrata = require('tilestrata');
var TileServer = tilestrata.TileServer;
var TileRequest = tilestrata.TileRequest;
var gm = require('tilestrata-gm');
var assert = require('chai').assert;
var fs = require('fs');

describe('Tranform Implementation "gm"', function() {
	describe('transform()', function() {
		it('should manipulate buffer', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.png');

			var inputBuffer = fs.readFileSync(__dirname + '/fixtures/blank.png');
			var inputHeaders = {'Content-Type': 'image/png'};

			var transform = gm(function(image) {
				return image.setFormat('jpeg').rotate('#ffffff', 90);
			});

			transform.transform(server, req, inputBuffer, inputHeaders, function(err, buffer, headers) {
				assert.isFalse(!!err, 'Unexpected error: ' + err);
				assert.deepEqual(headers, {'Content-Type': 'image/jpeg'});
				assert.instanceOf(buffer, Buffer);
				assert.deepEqual(buffer, fs.readFileSync(__dirname + '/data/result.jpg'));
				done();
			});
		});
		it('should not throw when given an invalid buffer', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.png');

			var inputBuffer = new Buffer('invalid', 'utf8');
			var inputHeaders = {'Content-Type': 'image/png'};
			var transform = gm(function(image) { return image; });

			transform.transform(server, req, inputBuffer, inputHeaders, function(err, buffer, headers) {
				assert.instanceOf(err, Error);
				assert.match(err.message, /Stream yields empty buffer/);
				done();
			});
		});
	});
});