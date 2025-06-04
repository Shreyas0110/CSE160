import * as THREE from 'three';
import { CityBackground } from './Objects/Background';

export class GameState{
    constructor(now, root){
        this.previousTime = now;
        this.currentTime = now;
        this.deltaTime = 1/20;
        this.bg = new CityBackground();
        this.simVelocity = 2;
        this.loaded = false;
        this.paused = false;
    }

    addRoot(root){
        this.root = root;
    }

    addToRoot(obj){
        this.root.add(obj);
    }

    updateTime(now){
        let prev = this.previousTime;
        this.previousTime = this.currentTime;
        this.currentTime = now;
        this.deltaTime = Math.min(now - prev, 1/20);
    }

    update(){
        this.bg.animate();
    }
}

export const GAME = new GameState(performance.now);