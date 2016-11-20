// author: Pat Xu
//
// adapted from sources:
// Ken Perlin's paper - http://mrl.nyu.edu/~perlin/noise/
// https://github.com/josephg/noisejs/blob/master/perlin.js
// https://en.wikipedia.org/wiki/Perlin_noise
// Fundamentals of Computer Graphics by Shirley and Marschner

var Noise = function() {

	// precomputed random indices [0,255]
  var indices = [
		151,160,137,91,90,15,
	  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
	];

  var worleyPoints;

	// p is a vector
	Noise.prototype.fbmPerlin = function(p, H, lacunarity, octaves) {
		var val = 0;
		for ( var j = 0; j < octaves; j++ ) {
			val += Math.abs(this.perlin( p.x/H, p.y/H, p.z ) * H);
			H *= lacunarity;
		}
		return val;
	};

  Noise.prototype.worleyInit = function(width, height){
    var size = Math.floor(width * height / 100);
    worleyPoints = new Array(size);
    for (var i = 0; i < size; i++) {
      var x = Math.random() * size;
      var y = Math.random() * size;
      worleyPoints[i] = new Vector(x,y);
    }
  };

  Noise.prototype.worley = function(width, height) {
    var distances = [width * height];
    var max = 0;
    var i = 0;
    for (var w = 0; w < width; w++) {
      for (var h = 0; h < height; h++) {
        var p = new Vector(w, h);
        distances[i] = distanceToClosest(p, worleyPoints);
        if (distances[i] > max) {
          max = distances[i];
        }
        i++;
      }
    }

    for (i = 0; i < width * height; i++) {
      distances[i] = distances[i] / max * 300 + 500;
    }

    return distances;
  };

	Noise.prototype.perlin = function(x, y, z) {
		// find unit grid cell containing point
		var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);

		// get relative xy coordinates of point within that cell
		x = x - X;
		y = y - Y;
		z = z - Z;

		// wrap the integer cells at 255
		X = X & 255;
		Y = Y & 255;
		Z = Z & 255;

		var n00 = grad(indices[Y], x, y, z);
		var n01 = grad(indices[Y+1], x, y-1, z);
		var n10 = grad(indices[Y], x-1, y, z);
		var n11 = grad(indices[Y+1], x-1, y-1, z);

		// Compute the fade curve values
		var u = fade(x), v = fade(y), w = fade(z);

		// gradient randomness
		var A = indices[X] + Y, AA = indices[A] + Z, AB = indices[A + 1] + Z;
		var B = indices[X + 1] + Y, BA = indices[B] + Z, BB = indices[B + 1] + Z;

		// interpolate
		return lerp(w,  lerp(v, lerp(u, grad(indices[AA], x, y, z),
		grad(indices[BA], x-1, y, z)),
		lerp(u, grad(indices[AB], x, y-1, z),
		grad(indices[BB], x-1, y-1, z))),
		lerp(v, lerp(u, grad(indices[AA + 1], x, y, z-1),
		grad(indices[BA + 1], x-1, y, z-1)),
		lerp(u, grad(indices[AB + 1], x, y-1, z-1),
		grad(indices[BB + 1], x-1, y-1, z-1))));
	};

};
