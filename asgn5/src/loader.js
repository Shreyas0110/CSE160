import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { GAME } from './gameState';
import { initBullets } from './Objects/Bullet';
import { initEnemies } from './Objects/Enemy';

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

export class LoaderManager{
  constructor(){
      this.manager = new THREE.LoadingManager();
      this.manager.onLoad = this.init;
      this.models = {
          city: {url: 'assets/sci-fi_city/scene.gltf'},
          player: {url: 'assets/player_ship/scene.gltf'},
      }
      this.gltfLoader = new GLTFLoader(this.manager);
  }

  startLoading(){
      
      for (const [name, model] of Object.entries(this.models)) {
          this.gltfLoader.load(model.url, (gltf) => {
            model.gltf = gltf;
            //console.log(dumpObject(model.gltf.scene));

            if(name == 'city'){
              let bg = GAME.bg;
              bg.initModels(model.gltf.scene);
            }

            else if(name == 'player'){
              GAME.player.setMesh(model.gltf.scene);
            }
          });
      }
  }

  init(){
    initBullets();
    initEnemies();
    GAME.loaded = true;
  }
}