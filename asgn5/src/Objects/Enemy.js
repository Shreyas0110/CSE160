import * as THREE from 'three'
import { GAME } from '../gameState'
import { GameObject } from './GameObject'
import { SphereCollider, EllipseCollider, BoxCollider } from '../collisions';

let enemyBlueShip;
let enemyOrangeShip;

export function initEnemies(){
  let enemyGeom = new THREE.SphereGeometry();
  enemyGeom.scale(1,1,1);
  let enemyBlueShipMESH = new THREE.MeshStandardMaterial({color: 0x0096FF});
  let enemyOrangeShipMESH = new THREE.MeshStandardMaterial({color: 0x8B4000});
  enemyBlueShip = new THREE.Mesh(enemyGeom, enemyBlueShipMESH);
  enemyOrangeShip = new THREE.Mesh(enemyGeom, enemyOrangeShipMESH);
  GAME.addEnemy(new EnemyBase('blue', new THREE.Vector3(0, 0, -2), null, 4));
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
    }

    setVelocity(velocity){
        this.velocity = velocity;
    }
}