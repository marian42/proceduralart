var scene = {};

seed = Math.round(Math.random() * 9007199254740991);
var canvas = document.getElementById("myCanvas");


if (getQueryParams(document.location.search).planet !== undefined) {
	seed = getQueryParams(document.location.search).planet;
}

document.getElementById('permalink').href = '/proceduralart/?planet=' + seed;

draw(canvas, seed);