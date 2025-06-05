import * as THREE from 'three'
import { GAME } from '../gameState'
import { GameObject } from './GameObject'
import { checkCollision } from '../collisions';

let enemyBlueShip;
let enemyOrangeShip;

export function initEnemies(){
  let enemyGeom = new THREE.SphereGeometry();
  let enemyBlueShipMESH = new THREE.MeshStandardMaterial({color: 0x0096FF});
  let enemyOrangeShipMESH = new THREE.MeshStandardMaterial({color: 0x8B4000});
  enemyBlueShip = new THREE.Mesh(enemyGeom, enemyBlueShipMESH);
  enemyBlueShip.scale.set(.3, .3, .3);
  enemyOrangeShip = new THREE.Mesh(enemyGeom, enemyOrangeShipMESH);
  enemyOrangeShip.scale.set(.3, .3, .3);
}

const states = Object.freeze({
    MOVE_TO_POSITION: 1,
    MOVE_LEFT: 2,
    MOVE_RIGHT: 3,
   });

export class EnemyBase extends GameObject{
    constructor(color, startFrom, goto, hp){
        if(color == 'blue')
            super(enemyBlueShip.clone());
        else {
            super(enemyOrangeShip.clone());
        }
        this.color = color;
        this.mesh.position.x = startFrom.x;
        this.mesh.position.y = startFrom.y;
        this.mesh.position.z = startFrom.z;
        this.state = states.MOVE_TO_POSITION;
        this.start = startFrom;
        this.goto = goto;
        this.hp = hp;
        this.initCollider();
        this.moveStartTime = 0;
        this.downSpeed = .5;
        this.interval = 1 * 1000;
        this.latSpeed = 0.5;
    }

    setVelocity(velocity){
        this.velocity = velocity;
    }

    collideWithPlayer(){
        if(checkCollision(this.collider, GAME.player.collider) == true){
            //GAME.player.remove();
            console.log("Your Score: ", GAME.score);
            GAME.paused = true;
        }
    }

    animate(){
        let dt = GAME.deltaTime;
        this.mesh.position.z += dt * this.downSpeed;
        let ct = GAME.currentTime;
        if(this.state == states.MOVE_TO_POSITION){
            let choice = Math.random();
            if(choice < 0.5){
                this.state = states.MOVE_LEFT;
            } else{
                this.state =states.MOVE_RIGHT;
            }
            this.moveStartTime = ct;
        } else{
            if(ct - this.moveStartTime > this.interval){
                if(this.state == states.MOVE_LEFT){
                    this.state = states.MOVE_RIGHT;
                }
                else{
                    this.state = states.MOVE_LEFT;
                }
                this.moveStartTime = ct;
            }
        }
        if(this.state == states.MOVE_LEFT){
            this.mesh.position.x -= dt * this.latSpeed;
        } else{
            this.mesh.position.x += dt * this.latSpeed;
        }
        this.collideWithPlayer();
    }
}

var lastTime = 0;
let interval = 2 * 1000;
let nextInterval = 0;

export function GenerateEnemies(){
    let ct = GAME.currentTime;
    if(ct - lastTime > nextInterval){
        let color = 'blue';
        let choice = Math.random();
        if(choice < 0.5)
            color = 'red';
        choice = Math.random();
        choice -= 0.5;
        choice *= 4;
        GAME.addEnemy(new EnemyBase(color, new THREE.Vector3(choice, 0, -4), null, 30));
        choice = Math.random();
        lastTime = ct;
        nextInterval = choice * interval + 0.2;
    }
}