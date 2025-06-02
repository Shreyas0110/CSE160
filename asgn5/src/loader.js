import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {LoadingManager} from 'three/addons/loaders/LoadingManager.js';

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

class LoaderManager{
    constructor(){
        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = this.init;
        this.models = {
            city: {url: 'assets/sci-fi_city/scene.gltf'},
        }
        this.gltfLoader = new GLTFLoader(manager);
    }

    startLoading(){
        
        for (const model of Object.values(models)) {
            gltfLoader.load(model.url, (gltf) => {
                model.gltf = gltf;
            });
        }
    }

    init(){}
}