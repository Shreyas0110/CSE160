import * as THREE from 'three';
import { CityBackground } from './Objects/Background';
import { Player } from './Objects/Player';

export class GameState{
    constructor(now, root){
        this.previousTime = now;
        this.currentTime = now;
        this.deltaTime = 1/20;
        this.bg = new CityBackground();
        this.simVelocity = 2;
        this.loaded = false;
        this.paused = false;
        this.player = new Player();
        this.MAX_X = 2.8;
        this.MAX_Z = 3.7;
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
        this.player.animate();
    }
}

export const GAME = new GameState(performance.now);