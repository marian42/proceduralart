seed = getRandomSeed();
var canvas = document.getElementById("myCanvas");

var btnDiscoverNew = document.getElementById('discovernew');

function discoverNew() {
	document.title = "Working..."
	btnDiscoverNew.innerHTML = 'working...';
	setTimeout(function() {
		var seed = getRandomSeed();
		draw(canvas, seed);
		btnDiscoverNew.innerHTML = 'discover new planet';
		document.title = "Every Planet Procedural";
		document.getElementById('permalink').href = '/proceduralart/?planet=' + seed;
	}, 0);

	return false;
}

if (getQueryParams(document.location.search).planet !== undefined) {
	seed = getQueryParams(document.location.search).planet;
} else {
	btnDiscoverNew.onclick = discoverNew;
}

document.getElementById('permalink').href = '/proceduralart/?planet=' + seed;

document.title = "Working...";
draw(canvas, seed);
document.title = "Every Planet Procedural";