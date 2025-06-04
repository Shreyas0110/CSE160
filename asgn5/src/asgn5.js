import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GAME } from './gameState';
import { LoaderManager } from './loader';

const FIXED_WIDTH = 600;
const FIXED_HEIGHT = 800;
const ASPECT_RATIO = FIXED_WIDTH /FIXED_HEIGHT;

const scene = new THREE.Scene();
GAME.addRoot(scene);
const camera = new THREE.PerspectiveCamera( 75, ASPECT_RATIO, 0.1, 1000 );
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
let dirlight = new THREE.DirectionalLight(0xffffff, 3);
dirlight.position.x = 1;
scene.add(dirlight);
//let pointlight = new THREE.PointLight(0xff0000, 10);
//pointlight.position.x = 1;
//pointlight.position.y = 3;
//scene.add(pointlight);

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

{
  const color = 0xFFFFFF;  // white
  const near = 5;
  const far = 25;
  scene.fog = new THREE.Fog(color, near, far);
}
{
  const planeGeometry = new THREE.PlaneGeometry(400, 400);
  const planeMat = new THREE.MeshBasicMaterial({color: 0x000000});
  const groundPlane = new THREE.Mesh(planeGeometry, planeMat);
  groundPlane.rotateX(THREE.MathUtils.degToRad(270));
  groundPlane.position.y = -50;
  scene.add(groundPlane);
}

camera.position.y = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set( 0, 0, 0 );
controls.update();

const skygeometry = new THREE.SphereGeometry(250);
const loader = new THREE.TextureLoader();
const skyboxTexture = loader.load( 'assets/skybox/Blue Nebula/Blue_Nebula_05-1024x1024.png' );
//scene.background = skyboxTexture;
skyboxTexture.colorSpace = THREE.SRGBColorSpace;
const skyMat = new THREE.MeshBasicMaterial({map: skyboxTexture, side: THREE.DoubleSide});
skyMat.fog = false;
const SKYBOX = new THREE.Mesh( skygeometry, skyMat );
GAME.addToRoot( SKYBOX );

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

let gltfManager = new LoaderManager();
gltfManager.startLoading();



renderer.setAnimationLoop( gameLoop );
function gameLoop(now) {
  GAME.updateTime(now);
  if(GAME.loaded && ! GAME.paused){
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    GAME.update();

    composer.render( scene, camera );
  }

}