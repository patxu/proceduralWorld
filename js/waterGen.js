// Author: Sidney Wijngaarde

// Water generation, interpolation, and animation

// Globals
/* var waterGeometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 ); */
/* waterGeometry.rotateX( - Math.PI / 2 ); */

/* waterData = waterGenWave( worldWidth, worldDepth ); */
/* waterVertices = waterGeometry.attributes.position.array; */

/* for ( var i = 0, j = 0, l = waterVertices.length; i < l; i ++, j += 3 ) { */
/*   waterVertices[ j + 1 ] = waterData[ i ] * 5; */
/* } */

// Generate a water wave mesh based on smooth noise
function waterGenWave(width, height) {
  var size = width * height, waterData = new Uint16Array( size );
  var z = Math.random() * 100;
  var noise = new Noise();
  var lacunarity = 5;
  var octaves = 2;
  var H = 60;

  for ( var i = 0; i < size; i ++ ) {
    var x = i % width, y = Math.floor( i / width );
    var p = new Vector(x, y, z);
    waterData[i] = noise.fbm(p, noise.perlin, H, lacunarity, octaves) + 500;
  }

  return waterData;
}

function waterSetVertices(waterVertices, waterData, minHeight){
  var waterMinHeight = minHeight || 75;

  for ( var i = 0, j = 0, l = waterVertices.length; i < l; i ++, j += 3 ) {
    if (waterData[i] < waterMinHeight) {
      waterVertices[ j + 1 ] = 500;
      waterData[i] = waterMinHeight;
    } else {
      waterVertices[ j + 1 ] = waterData[ i ];
    }
  } // end for

  return waterVertices;
}

// Interpolate between two water wave states
function waterLerp(waterCurrent, waterNext, t) {


  return waterVertices;
}

// Animate the waves
function waterAnimate(){
  waterData = waterGenWave( worldWidth, worldDepth );
  waterVertices = waterGeometry.attributes.position.array;

  waterMinHeight = 75;
  waterSetVertices(waterVertices, waterData, waterMinHeight);
  waterGeometry.attributes.position.needsUpdate = true;
}
