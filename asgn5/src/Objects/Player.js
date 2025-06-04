import * as THREE from 'three'
import { GAME } from '../gameState'
import { GameObject } from './GameObject'
import { inputManager } from '../inputManager';

const animStatus = Object.freeze({
    FLAT: 1,
    TAKING_DAMAGE: 2,
    TURNING_LEFT: 3,
    TURNING_RIGHT: 4,
    RESET_LEFT: 5,
    RESET_RIGHT: 6
   });

export class Player extends GameObject{
    
    constructor(){
        super();
        this.moveSpeed = 1.3;
        this.animStatus = animStatus.FLAT;
        this.animStartTime = 0;
        this.rotateSpeed = 20;
    }

    setMesh(Mesh){
        super.setMesh(Mesh);
        this.mesh.scale.set(0.05, 0.05, 0.05);
        this.mesh.rotateY(THREE.MathUtils.degToRad(180));
        GAME.addToRoot(this.mesh);
        
    }

    turn(moveX, dt){
        let currentTime = GAME.currentTime;
        if((moveX <= 0 && this.animStatus == animStatus.TURNING_RIGHT) || (this.animStatus == animStatus.RESET_RIGHT)){
            //console.log('e');
            this.animStatus = animStatus.RESET_RIGHT;
            //this.animStartTime = currentTime;
        }
        else if((moveX >= 0 && this.animStatus == animStatus.TURNING_LEFT) || (this.animStatus == animStatus.RESET_LEFT)){
            this.animStatus = animStatus.RESET_LEFT;
            //this.animStartTime = currentTime;
        }
        else if(moveX < 0){
            this.animStatus = animStatus.TURNING_LEFT;
        }
        else if(moveX > 0){
            this.animStatus = animStatus.TURNING_RIGHT;
        }
        else{
            this.animStatus = animStatus.FLAT;
        }

        let rot = THREE.MathUtils.radToDeg(this.mesh.rotation.z);

        if ((this.animStatus == animStatus.TURNING_LEFT) || (this.animStatus == animStatus.RESET_RIGHT)) {
            this.mesh.rotation.z += (THREE.MathUtils.degToRad(-this.rotateSpeed * dt)); // rotates positive: to the right
        } 
        else if ((this.animStatus == animStatus.TURNING_RIGHT) || (this.animStatus == animStatus.RESET_LEFT)) {
            this.mesh.rotation.z += (THREE.MathUtils.degToRad(this.rotateSpeed * dt)); // rotates negative: to the left
        } 
        rot = THREE.MathUtils.radToDeg(this.mesh.rotation.z);
        if(rot < 0.5 && rot > -0.5){
            this.animStatus = animStatus.FLAT;
            this.mesh.rotation.z = 0;
        }
        if(rot > 60){
            this.mesh.rotation.z = THREE.MathUtils.degToRad(60);
        }
        if(rot < -60){
            this.mesh.rotation.z = THREE.MathUtils.degToRad(-60);
        }
        console.log(rot, this.animStatus, moveX);
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
        this.turn(moveX, dt);
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