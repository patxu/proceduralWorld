// author: Pat Xu

// linear interpolation
function lerp(t, a, b) {
	return a + t * (b - a);
}

// fade curve
function fade(t) {
	return t*t*t*(t*(t*6-15)+10);
}

// converts lo 4 bits of hash code into 12 gradient directions
// http://mrl.nyu.edu/~perlin/noise/
function grad(hash, x, y, z) {
	var h = hash & 15;
	var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
	return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
}
