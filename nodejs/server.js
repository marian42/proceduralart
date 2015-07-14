var http = require('http');
var Canvas = require('canvas');
var fs = require('fs');

var noise = require('../perlin.js').noise;

eval(fs.readFileSync('../seedrandom.min.js')+'');
eval(fs.readFileSync('../helpers.js')+'');
eval(fs.readFileSync('../planet.js')+'');

http.createServer(function (request, response) {
	var canvas = new Canvas(640, 360);
	var seed = getRandomSeed();
	draw(canvas, seed);
	var stream = canvas.createPNGStream();
 	response.writeHead(200, {"Content-Type": "image/png"});    
 	stream.pipe(response);
}).listen(80, '127.0.0.1');

console.log('Ready');