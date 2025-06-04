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
        this.rotateSpeed = 30;
    }

    setMesh(Mesh){
        super.setMesh(Mesh);
        this.mesh.scale.set(0.05, 0.05, 0.05);
        this.mesh.rotateY(THREE.MathUtils.degToRad(180));
        GAME.addToRoot(this.mesh);
        
    }

    turn(moveX, dt) {
    const rotSpeedRad = THREE.MathUtils.degToRad(this.rotateSpeed * dt);
    const rotDeg = THREE.MathUtils.radToDeg(this.mesh.rotation.z);

    // --- Handle state transitions ---
    if (moveX < 0) {
        if (this.animStatus !== animStatus.TURNING_LEFT) {
            this.animStatus = animStatus.TURNING_LEFT;
        }
    } else if (moveX > 0) {
        if (this.animStatus !== animStatus.TURNING_RIGHT) {
            this.animStatus = animStatus.TURNING_RIGHT;
        }
    } else {
        if (this.animStatus === animStatus.TURNING_LEFT) {
            this.animStatus = animStatus.RESET_LEFT;
        } else if (this.animStatus === animStatus.TURNING_RIGHT) {
            this.animStatus = animStatus.RESET_RIGHT;
        }
    }

    // --- Apply rotation based on state ---
    switch (this.animStatus) {
        case animStatus.TURNING_LEFT:
            this.mesh.rotation.z -= rotSpeedRad;
            break;

        case animStatus.TURNING_RIGHT:
            this.mesh.rotation.z += rotSpeedRad;
            break;

        case animStatus.RESET_LEFT:
        case animStatus.RESET_RIGHT:
            // Smoothly interpolate back to 0 rotation
            if (Math.abs(rotDeg) <= THREE.MathUtils.radToDeg(rotSpeedRad)) {
                this.mesh.rotation.z = 0;
                this.animStatus = animStatus.FLAT;
            } else {
                const direction = -Math.sign(this.mesh.rotation.z);
                this.mesh.rotation.z += direction * rotSpeedRad;
            }
            break;
    }

    // --- Clamp rotation limits ---
    const clampedDeg = THREE.MathUtils.radToDeg(this.mesh.rotation.z);
    if (clampedDeg > 60) {
        this.mesh.rotation.z = THREE.MathUtils.degToRad(60);
    } else if (clampedDeg < -60) {
        this.mesh.rotation.z = THREE.MathUtils.degToRad(-60);
    }
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