function init() {
  container = document.getElementById( 'container' );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
  scene = new THREE.Scene();

  controls = new THREE.FirstPersonControls( camera );
  controls.movementSpeed = 1000;
  controls.lookSpeed = 0.1;

  data = generateHeight( worldWidth, worldDepth );

  camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;
  var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
  geometry.rotateX( - Math.PI / 2 );

  var vertices = geometry.attributes.position.array;
  for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    vertices[ j + 1 ] = data[ i ] * 10;
  }

  texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
  scene.add( mesh );

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
