import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const FIXED_WIDTH = 800;
const FIXED_HEIGHT = 600;
const ASPECT_RATIO = FIXED_WIDTH /FIXED_HEIGHT;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, ASPECT_RATIO, 0.1, 1000 );
scene.add(new THREE.AmbientLight(0xffffff, 1));
scene.add(new THREE.DirectionalLight(0xffffff, 5));
//scene.add(new THREE.PointLight());

const renderer = new THREE.WebGLRenderer({antialias: false});
renderer.setSize(FIXED_WIDTH, FIXED_HEIGHT, false);
renderer.domElement.style.imageRendering = 'pixelated';
document.body.appendChild( renderer.domElement );

let composer = new EffectComposer( renderer );
{
    composer.addPass( new RenderPass( scene, camera ) );
    const outputPass = new OutputPass();
    composer.addPass( outputPass );
}

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set( 0, 0, 0 );
controls.update();

const geometry = new THREE.SphereGeometry(1, 10, 10);
geometry.scale(3, 1, 1);
const cube = createFakeBloom(geometry);//new THREE.Mesh( geometry, material );
//scene.add( cube );

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

{
  const gltfLoader = new GLTFLoader();
  const url = 'assets/sci-fi_city/scene.gltf';
  gltfLoader.load(url, (gltf) => {
    const root = gltf.scene;
    scene.add(root);
    console.log(dumpObject(root).join('\n'));
  });
}

function resizeCanvas() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenAspect = screenWidth / screenHeight;

  let displayWidth, displayHeight;

  if (screenAspect > ASPECT_RATIO) {
    // Window is wider than 4:3 — pillarbox
    displayHeight = screenHeight;
    displayWidth = displayHeight * ASPECT_RATIO;
  } else {
    // Window is taller than 4:3 — letterbox
    displayWidth = screenWidth;
    displayHeight = displayWidth / ASPECT_RATIO;
  }

  renderer.domElement.style.width = `${displayWidth}px`;
  renderer.domElement.style.height = `${displayHeight}px`;
  renderer.domElement.style.left = `${(screenWidth - displayWidth) / 2}px`;
  renderer.domElement.style.padding = 0;
  renderer.domElement.style.margin = 'auto';
  renderer.domElement.style.top = `${(screenHeight - displayHeight) / 2}px`;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

renderer.setAnimationLoop( animate );
function animate() {

  //cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  composer.render( scene, camera );

}



/*
Credit - https://codepen.io/boytchev/pen/ExdmvxE
*/
function createFakeBloom(baseGeometry, {
  layers = 5,
  maxScale = 2,
  baseColor = 0xffaa00,
  opacityFalloff = 0.2
} = {}) {
  const bloom = new THREE.Group();

  for (let i = 0; i < 1; i += 1 / layers) {
    const scale = 1 + i * (maxScale - 1);
    const color =  baseColor;

    const mat = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 1 - Math.pow(i, opacityFalloff),
      emissive: color,
      emissiveIntensity: 1
    });

    const glowMesh = new THREE.Mesh(baseGeometry.clone(), mat);
    glowMesh.scale.setScalar(scale, scale, scale);
    bloom.add(glowMesh);
  }

  return bloom;
}
