import * as THREE from 'three';
import { CityBackground } from './Objects/Background';
import { Player, ListItem } from './Objects/Player';
import {List, Item} from 'linked-list'
import { GenerateEnemies } from './Objects/Enemy';

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
        this.enemies = new List();
    }

    addEnemy(enemy){
        this.enemies.append( new ListItem(enemy));
        this.addToRoot(enemy.mesh);
    }

    animateEnemies(){
        let n = this.enemies.head;
    
        while(n != null){
            let b = n.value;
            b.animate();
            n = n.next;
        }
        
    }

    deleteEnemies(){
        let n = this.enemies.head;
    
        while(n != null){
            let b = n.value;
            if(b.mesh.position.z > this.MAX_Z+0.3){
                b.remove();
            }
            if (b.removed == true){
                let t = n.next;
                n.detach();
                n = t;
            } else{
                n = n.next;
            }
        }
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
        GenerateEnemies();
        this.bg.animate();
        this.player.animate();
        this.animateEnemies();
        this.deleteEnemies();
    }
}

export const GAME = new GameState(performance.now);