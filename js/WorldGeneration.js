// author: Pat Xu
function generateHeight( width, height ) {

  var size = width * height, data = new Uint16Array( size );
  var z = Math.random() * 100;
  var noise = new Noise();
  var lacunarity = 5;
  var octaves = 3;
  var H = 8;

  for ( var i = 0; i < size; i ++ ) {
    var x = i % width, y = Math.floor( i / width );
    var p = new Vector(x, y, z);
    data[i] = noise.fbm(p, noise.perlin, H, lacunarity, octaves);
  }

  return data;

}
