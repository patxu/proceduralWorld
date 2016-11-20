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
  perlin = new Noise(), quality = 1, z = Math.random() * 100;

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

/* Interpolate between two water wave states
 * @param {array} waterVertices - List of vertices being rendered
 * @param {array} waterCurrent  - Positions of the current state
 * @param {array} waterNext     - Positions of the next state
 * @param {int}   t             - Interpolation fraction
 */
function waterLerp(waterData, waterCurrent, waterNext, t) {
  var size = worldWidth * worldDepth, waterData = new Uint8Array( size );
  for ( var j = 0; j < 4; j ++ ) {

    for ( var i = 0; i < size; i ++ ) {
      // ~~ is used as an optimized Math.floor
      var x = i % worldWidth, y = ~~ ( i / worldWidth );
      waterData[ i ] =  lerp(t, waterCurrent[i], waterNext[i]);
    }

  }

  return waterData;
}

var worldWidth = 256, worldDepth = 256;
// Animate the waves
var waterCount = 1;
var waterCurrent = waterGenWave(worldWidth, worldDepth);
var waterNext = waterGenWave(worldWidth, worldDepth);
var waterMinHeight = 75;

var newStates = 100;
function waterAnimate(){
  if(waterCount % newStates === 0){
    waterCurrent = waterNext;
    waterNext = waterGenWave(worldWidth, worldDepth);
  }

    waterVertices = waterGeometry.attributes.position.array;
    waterData = waterLerp(waterData, waterCurrent, waterNext, (waterCount % newStates)/newStates);
    
    waterSetVertices(waterVertices, waterData, waterMinHeight);
    waterGeometry.attributes.position.needsUpdate = true;

  waterCount++;
}
