# Procedural World Generation
#### Authors: Sidney Wijngaarde and Pat Xu
#### [Presentation](https://docs.google.com/presentation/d/15x-g8li7KDZ4iqEUCILEOowCqIB52Eww9zLpJswj4Xs/edit?usp=sharing)

<img src="imgs/final_world.png" height=400x>


## Techniques
Overview of major components and our approach.

### [Three.js](https://threejs.org/)
- framework for interfacing with WebGL
- simplifies camera control, rendering, texturing, mesh generation

### Land
- vertex mesh with displacement via fBm Perlin noise

  <img src="imgs/perlin_gradients.png" height=200x>
  <img src="imgs/perlin_fBm.png" height=200x>


### Water Generation
- vertex mesh with displacement via Worley noise

  <img src="imgs/worley.png" height=200x>
  <img src="imgs/worley_texture.jpg" height=200x>

## Inspiration
Some of the images that inspired this project.

  <img src="imgs/inspiration1.png" height=200x>
  <img src="imgs/inspiration2.jpg" height=200x>

  <img src="imgs/inspiration3.jpg" height=200x>
  <img src="imgs/inspiration4.jpg" height=200x>

## Future Work
- WebGL vertex and fragment shader for water reflection

  <img src="imgs/water_reflection.jpg" height=200x>

- L-system support for vegetation

  <img src="imgs/l_system_plants.jpg" height=200x>
  <img src="imgs/l_system_tree.jpg" height=200x>
