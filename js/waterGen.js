// Author: Sidney Wijngaarde

// Water generation, interpolation, and animation

// Globals
var worldWidth = 256, worldDepth = 256;
// Animate the waves
var waterCount = 1;
var waterCurrent = waterGenWave(worldWidth, worldDepth);
var waterNext = waterGenWave(worldWidth, worldDepth);
var waterMinHeight = 100;

var newStates = 50;

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
      waterVertices[ j + 1 ] = waterData[ i ] * 7;
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
