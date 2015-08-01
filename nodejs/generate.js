/*
Generates one picture, upscales it to 1080p and saves it in the output folder.
Currently too slow because of missing hardware support for the canvas module.

How to install canvas module:
https://github.com/Automattic/node-canvas/wiki/Installation---Windows
*/

var Canvas = require('canvas');
var fs = require('fs');

var noise = require('../perlin.js').noise;

eval(fs.readFileSync('../seedrandom.min.js')+'');
eval(fs.readFileSync('../helpers.js')+'');
eval(fs.readFileSync('../planet.js')+'');

function resize(img, scale) {
	// http://phoboslab.org/log/2012/09/drawing-pixels-is-hard
    var widthScaled = img.width * scale;
    var heightScaled = img.height * scale;
    
    var origPixels = img.getContext('2d').getImageData(0, 0, img.width, img.height);
    
    var scaled = new Canvas(widthScaled, heightScaled);
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

var counter = 0;

function createImage(seed) {
	console.time("render_" + counter);
	var canvas = new Canvas(640, 360);
	draw(canvas, seed);
	canvas = resize(canvas, 3);

	console.timeEnd("render_" + counter);
	counter++;
	return canvas;
}

function generate() {
	var seed = getRandomSeed();
	var canvas = createImage(seed);

	var fs = require('fs');
	var out = fs.createWriteStream(__dirname + '/output/' + seed + '.png');
	var stream = canvas.pngStream();

	stream.on('data', function(chunk){
		out.write(chunk);
	});

	stream.on('end', function(){
		console.log('saved png');
	});
}

generate();