/*
A simple nodejs server that provides a procedural image.
Currently too slow because of missing hardware support for the canvas module.

How to install canvas module:
https://github.com/Automattic/node-canvas/wiki/Installation---Windows
*/

var http = require('http');
var Canvas = require('canvas');
var fs = require('fs');

var noise = require('../perlin.js').noise;

eval(fs.readFileSync('../seedrandom.min.js')+'');
eval(fs.readFileSync('../helpers.js')+'');
eval(fs.readFileSync('../planet.js')+'');

var supply = {
	size: 5,
	images: [],
	working: false}

function resize(img, scale) {
	// http://phoboslab.org/log/2012/09/drawing-pixels-is-hard
    var widthScaled = img.width * scale;
    var heightScaled = img.height * scale;
    
    var origPixels = img.getContext('2d').getImageData(0, 0, img.width, img.height);
    
    var scaled = new Canvas.Canvas(widthScaled, heightScaled);
    var scaledCtx = scaled.getContext('2d');
    var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );
    
    for( var y = 0; y < heightScaled; y++ ) {
        for( var x = 0; x < widthScaled; x++ ) {
            var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
            var indexScaled = (y * widthScaled + x) * 4;
            scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
            scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
            scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
            scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
        }
    }
    scaledCtx.putImageData( scaledPixels, 0, 0 );
    return scaled;
}

function createImage() {
	console.time("render");
	var canvas = new Canvas.Canvas(640, 360);
	var seed = getRandomSeed();
	draw(canvas, seed);
	canvas = resize(canvas, 3);

	console.timeEnd("render");
	return canvas;
}

function getImage() {
	if (supply.images.length > 0) {
		var image = supply.images.pop();
		console.log('Stored: ' + supply.images.length);

		// TODO updateSupply() as thread
		return image;
	} else {
		console.log('Supply empty!');
		return createImage();
	}
}

function updateSupply() {
	if (supply.working) {
		return;
	}

	supply.working = true;

	while (supply.images.length < supply.size) {
		supply.images.push(createImage());
		console.log('Stored: ' + supply.images.length);
	}

	supply.working = false;
}


http.createServer(function (request, response) {
	var canvas = createImage();

	var stream = canvas.createPNGStream();
 	response.writeHead(200, {"Content-Type": "image/png"});    
 	stream.pipe(response);
}).listen(80, '127.0.0.1');

console.log('Ready - open a browser and go to http://localhost:80/');