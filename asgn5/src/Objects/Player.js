import * as THREE from 'three'
import { GAME } from '../gameState'
import { GameObject } from './GameObject'
import { inputManager } from '../inputManager';

export class Player extends GameObject{
    constructor(){
        super();
        this.moveSpeed = 1.3;
        this.animStatus
    }

    setMesh(Mesh){
        super.setMesh(Mesh);
        this.mesh.scale.set(0.05, 0.05, 0.05);
        this.mesh.rotateY(THREE.MathUtils.degToRad(180));
        GAME.addToRoot(this.mesh);
        
    }

    animate(){
        let dt = GAME.deltaTime;
        let ds = this.moveSpeed * dt;
        let moveX = 0;
        let moveZ = 0;
        if(inputManager.keys['left'].down == true){
            moveX -= 1;
        }
        if(inputManager.keys['right'].down == true){
            moveX += 1;
        }
        if(inputManager.keys['up'].down == true){
            moveZ -= 1;
        }
        if(inputManager.keys['down'].down == true){
            moveZ += 1;
        }
        this.mesh.position.x += ds * moveX;
        this.mesh.position.z += ds * moveZ;

        if(this.mesh.position.x < -1 * GAME.MAX_X){
            this.mesh.position.x = -1 * GAME.MAX_X;
        } else if (this.mesh.position.x > GAME.MAX_X){
            this.mesh.position.x = GAME.MAX_X;
        }

        if(this.mesh.position.z < -1 * GAME.MAX_Z){
            this.mesh.position.z = -1 * GAME.MAX_Z;
        } else if (this.mesh.position.z > GAME.MAX_Z){
            this.mesh.position.z = GAME.MAX_Z;
        }
    }
}