// author: Pat Xu

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

  var noise = new Noise();

  for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

    vector3.x = data[ j - 2 ] - data[ j + 2 ];
    vector3.y = 2;
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
    vector3.normalize();

    shade = vector3.dot( sun );

    var variation  = Math.abs(noise.perlin(data[j], Math.random(), Math.random()));

    var b1 = imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
    var b2 = imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    var b3 = imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

    var snowLine = 80;

    if (data[j] < snowLine) {
      imageData[ i ] = b1;
      imageData[ i+1 ] = b2;
      imageData[ i+2 ] = b3;
    } else if (data[j] < snowLine + 30){
      var t = sinFade((1/8)*Math.min((Math.abs((data[j]-snowLine) / 50)),1));
      imageData[ i ] = lerp(t, b1, 255 * (1 - variation));
      imageData[ i+1 ] = lerp(t, b2, 255 * (1 - variation));
      imageData[ i+2 ] = lerp(t, b3, 255 * (1 - variation));
    } else {
      imageData[ i ] = 255 * (1 - variation);
      imageData[ i+1 ] = 255 * (1 - variation);
      imageData[ i+2 ] =  255 * (1 - variation);
    }
  }

  context.putImageData( image, 0, 0 );

  var scale = 32;
  // var scale = 4;

  canvasScaled = document.createElement( 'canvas' );
  canvasScaled.width = width * scale;
  canvasScaled.height = height * scale;

  context = canvasScaled.getContext( '2d' );
  context.scale( scale, scale );
  context.drawImage( canvas, 0, 0 );

  image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
  imageData = image.data;

  for ( var i = 0, l = imageData.length; i < l; i += scale ) {

    var v = ~~ ( Math.random() * 5 );

    imageData[ i ] += v;
    imageData[ i + 1 ] += v;
    imageData[ i + 2 ] += v;

  }

  context.putImageData( image, 0, 0 );

  return canvasScaled;

}
