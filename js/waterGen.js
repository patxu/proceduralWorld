// Author: Sidney Wijngaarde

// Water generation, interpolation, and animation

// Globals
var worldWidth = 256, worldDepth = 256;
// Animate the waves
var waterCount = 1;
var waterCurrent = waterGenWave(worldWidth, worldDepth);
var waterNext = waterGenWave(worldWidth, worldDepth);
var waterMinHeight = 100;

var newStates = 1500;

// Generate a water wave mesh based on smooth noise


function waterGenWave(width, height) {
  var size = width * height, waterData = new Uint16Array( size );
  var noise = new Noise();

  noise.worleyInit(width, height);
  waterData = noise.worley(width, height);

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

/* Interpolate between two water wave states
 * @param {array} waterVertices - List of vertices being rendered
 * @param {array} waterCurrent  - Positions of the current state
 * @param {array} waterNext     - Positions of the next state
 * @param {int}   t             - Interpolation fraction
 */
function waterLerp(waterData, waterCurrent, waterNext, t) {
  var size = worldWidth * worldDepth, waterData = new Uint16Array( size );
  for ( var j = 0; j < 4; j ++ ) {
    for ( var i = 0; i < size; i ++ ) {
      // ~~ is used as an optimized Math.floor
      var x = i % worldWidth, y = ~~ ( i / worldWidth );
      waterData[ i ] =  lerp(t, waterCurrent[i], waterNext[i]);
    }
  }

  return waterData;
}

var wait = 0;
function waterAnimate(){
  if(waterCount % newStates === 0){
    // if(wait === 10) {
      waterCurrent = waterNext;
      waterNext = waterGenWave(worldWidth, worldDepth);
      wait = 0;
    // } else {
    //   wait++;
    //   return
    // }
  }

  waterVertices = waterGeometry.attributes.position.array;
  t = (waterCount % newStates)/newStates;
  t = sinFade(t);
  waterData = waterLerp(waterData, waterCurrent, waterNext, t);

  waterSetVertices(waterVertices, waterData, waterMinHeight);
  waterGeometry.attributes.position.needsUpdate = true;

  waterCount++;
}
