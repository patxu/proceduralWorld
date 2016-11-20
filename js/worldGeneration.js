
if ( ! Detector.webgl ) {

  Detector.addGetWebGLMessage();
  document.getElementById( 'container' ).innerHTML = "";

}

var container, stats;

var camera, controls, scene, renderer;

var terrainMesh, texture, waterMesh;
var terrainVertices;

var counter = 0;

var worldWidth = 256, worldDepth = 256,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

init();
animate();

function init() {
  container = document.getElementById( 'container' );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
  scene = new THREE.Scene();

  controls = new THREE.FirstPersonControls( camera );
  controls.movementSpeed = 1000;
  controls.lookSpeed = 0.1;

  // Terrain Generation
  terrainData = generateHeight( worldWidth, worldDepth );

  camera.position.y = terrainData[ worldHalfWidth + worldHalfDepth * worldWidth ] * 100 + 500;
  camera.position.z = 600;

  var terrainGeometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
  terrainGeometry.rotateX( - Math.PI / 2 );

  terrainVertices = terrainGeometry.attributes.position.array;

  for ( var i = 0, j = 0, l = terrainVertices.length; i < l; i ++, j += 3 ) {

    if (terrainData[i] < 50) {
      terrainVertices[ j + 1 ] = 500;
      terrainData[i] = 50;
    } else {
      terrainVertices[ j + 1 ] = terrainData[ i ] * 10;
    }

  }

  texture = new THREE.CanvasTexture( generateTexture( terrainData, worldWidth, worldDepth ) );
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  terrainMesh = new THREE.Mesh( terrainGeometry, new THREE.MeshBasicMaterial( { map: texture } ) );
  scene.add( terrainMesh );

  // End Terrain Generation

  // Water Generation
  waterGeometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
  waterGeometry.dynamic = true;
  waterGeometry.rotateX( - Math.PI / 2 );

  waterData = waterGenWave( worldWidth, worldDepth );
  waterVertices = waterGeometry.attributes.position.array;

  waterMinHeight = 75;
  waterSetVertices(waterVertices, waterData, waterMinHeight);

  waterMesh = new THREE.Mesh( waterGeometry, new THREE.MeshBasicMaterial(
  {color: 0x42A5F5, 
   transparent: true,
   opacity: 0.9}));
  scene.add( waterMesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xbfd1e5 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.innerHTML = "";
  container.appendChild( renderer.domElement );

  stats = new Stats();
  container.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  controls.handleResize();

}

function generateHeight( width, height ) {

  var size = width * height, data = new Uint8Array( size ),
  perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

  for ( var j = 0; j < 4; j ++ ) {

    for ( var i = 0; i < size; i ++ ) {

      // ~~ is used as an optimized Math.floor
      var x = i % width, y = ~~ ( i / width );
      data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

    }

    quality *= 5;

  }

  return data;

}

function generateTexture( data, width, height ) {

  var canvas, canvasScaled, context, image, imageData,
  level, diff, vector3, sun, shade;

  vector3 = new THREE.Vector3( 0, 0, 0 );

  sun = new THREE.Vector3( 1, 1, 1 );
  sun.normalize();

  canvas = document.createElement( 'canvas' );
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext( '2d' );
  context.fillStyle = '#000';
  context.fillRect( 0, 0, width, height );

  image = context.getImageData( 0, 0, canvas.width, canvas.height );
  imageData = image.data;

  for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

    vector3.x = data[ j - 2 ] - data[ j + 2 ];
    vector3.y = 2;
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
    vector3.normalize();

    shade = vector3.dot( sun );

    imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
  }

  context.putImageData( image, 0, 0 );

  // Scaled 4x

  canvasScaled = document.createElement( 'canvas' );
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext( '2d' );
  context.scale( 4, 4 );
  context.drawImage( canvas, 0, 0 );

  image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
  imageData = image.data;

  for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

    var v = ~~ ( Math.random() * 5 );

    imageData[ i ] += v;
    imageData[ i + 1 ] += v;
    imageData[ i + 2 ] += v;

  }

  context.putImageData( image, 0, 0 );

  return canvasScaled;

}

function animate() {
  counter ++;
  requestAnimationFrame( animate );
  waterAnimate();

  
  render();
  stats.update();

}

function render() {
  controls.update( clock.getDelta() );
  renderer.render( scene, camera );
}
