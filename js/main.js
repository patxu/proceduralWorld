// from https://github.com/mrdoob/three.js/blob/master/examples/canvas_geometry_terrain.html

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
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x7084a3, 0.0003 );
  // scene.fog = new THREE.Fog( 0x7084a3, 100, 1000 );


  controls = new THREE.FirstPersonControls( camera );
  controls.movementSpeed = 1000;
  controls.lookSpeed = 0.1;

  // Terrain Generation
  terrainData = generateHeight( worldWidth, worldDepth );

  camera.position.y = terrainData[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;
  camera.position.z = 600;

  var terrainGeometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
  terrainGeometry.rotateX( - Math.PI / 2 );

  terrainVertices = terrainGeometry.attributes.position.array;

  for ( var i = 0, j = 0, l = terrainVertices.length; i < l; i ++, j += 3 ) {
    terrainVertices[ j + 1 ] = terrainData[ i ] * 10 + 300;
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

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  controls.handleResize();

}


function animate() {
  counter ++;
  requestAnimationFrame( animate );
  waterAnimate();
  render();
}

function render() {
  controls.update( clock.getDelta() );
  renderer.render( scene, camera );
}
