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
  var size = width * height, waterData = new Uint8Array( size ),
  perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

  for ( var j = 0; j < 4; j ++ ) {

    for ( var i = 0; i < size; i ++ ) {
      // ~~ is used as an optimized Math.floor
      var x = i % width, y = ~~ ( i / width );
      waterData[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
    }

    quality *= 5;
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
      waterVertices[ j + 1 ] = waterData[ i ] * 8;
    }
  } // end for

  return waterVertices;
}

// Interpolate between two water wave states
function waterLerp(waterCurrent, waterNext) {
  
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
