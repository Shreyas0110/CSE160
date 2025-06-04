import { seededRandom } from "three/src/math/MathUtils.js";
import { GAME } from "../gameState";
import * as THREE from 'three'

export class CityBackground{
    constructor(){
    }

    initModels(gltf){
        let buildings = gltf.getObjectByName('Torres');
        this.baseScene = new THREE.Scene();
        this.buildings = new Map();
        let bbox = new THREE.Box3();
        let center = new THREE.Vector3();
        for (const building of buildings.children){
            {
                bbox.getCenter(center);
                building.position.sub(center);
                building.scale.set(0.1, 0.1, 0.1);
                building.position.y = -13;
                building.updateMatrixWorld(true);
                bbox.setFromObject(building);
                let size = new THREE.Vector3();
                bbox.getSize(size);
                if(size.x > 0.01){
                    this.buildings.set(building.name, {building, size});
                }
                    
            }

        }
        //console.log(this.buildings);
        this.layoutBuildings();
        this.baseScene.rotateY(180);
        let test = this.baseScene.clone();
        let test2 = this.baseScene.clone();
        test.rotateY(180);
        test2.rotateY(90);
        test.position.z = 5;
        test2.position.y -= 5;
        test.position.y -= 2;
        let scene = new THREE.Scene();
        scene.add(this.baseScene);
        scene.add(test);
        scene.add(test2);
        this.s1 = scene;
        this.s1.position.y -= 2;
        this.s2 = this.s1.clone();
        this.s2.position.z = 45;
        this.s3 = this.s1.clone();
        this.s3.position.z = -45;
        GAME.addToRoot(this.s1);
        GAME.addToRoot(this.s2);
        GAME.addToRoot(this.s3);
    }

    layoutBuildings(gap = 0.5, maxRowWidth = 20) {
        let currentX = 0;
        let currentY = 0;
        let rowHeight = 0;

        const positions = [];

        for (let building of this.buildings.values()) {
            let box = building.size;
            const width = box.z;
            const height = box.x;

            if (currentX + width > maxRowWidth) {
                // Wrap to next row
                currentX = 0;
                currentY += rowHeight + gap;
                rowHeight = 0;
            }

            // Place box
            building.building.position.z = currentX;
            building.building.position.x = currentY;

            //console.log(building.building.name, currentX, currentY);
            // Advance x
            currentX += width + gap;

            // Update max row height
            rowHeight = Math.max(rowHeight, height);
            this.baseScene.add(building.building);
        }
    }

    //Despawn when z = 43
    animate(){
        let dt = GAME.deltaTime;
        let speed = GAME.simVelocity;

        let ds = dt * speed;
        this.s1.position.z += ds;
        this.s2.position.z += ds;
        this.s3.position.z += ds;
        if(this.s1.position.z >=45){
            this.s1.position.z = -45;
        }
        if(this.s2.position.z >=45){
            this.s2.position.z = -45;
        }
        if(this.s3.position.z >=45){
            this.s3.position.z = -45;
        }

    }
}

