import * as THREE from 'three'
import { GAME } from '../gameState'
import { GameObject } from './GameObject'
import { SphereCollider, EllipseCollider, BoxCollider, checkCollision } from '../collisions';

let playerBlueBullet;
let playerOrangeBullet;
let ellipseBulletGeom;

export function initBullets(){
  ellipseBulletGeom = new THREE.SphereGeometry();
  playerBlueBullet = createFakeBloom(ellipseBulletGeom, {baseColor: 0x0096FF});
  playerBlueBullet.scale.set(0.04,0.04,0.12);
  playerOrangeBullet = createFakeBloom(ellipseBulletGeom, {baseColor: 0x8B4000});
  playerOrangeBullet.scale.set(0.04,0.04,0.12);
}

class BulletBase extends GameObject{

  setVelocity(velocity){
    this.velocity = velocity
  }
  animate(){
    let dt = GAME.deltaTime;
    if(this.velocity.x != 0){
      this.mesh.position.x += this.velocity.x * dt;
    }
    this.mesh.position.z += this.velocity.y * dt;

    if(this.mesh.position.x < -1 * GAME.MAX_X+0.3){
      this.remove();
    } else if (this.mesh.position.x > GAME.MAX_X+0.3){
      this.remove();
    }

    if(this.mesh.position.z < -1 * (GAME.MAX_Z+0.3)){
      this.remove();
    } else if (this.mesh.position.z > GAME.MAX_Z+0.3){
      this.remove();
    }
    
  }
}

export class PlayerBullet extends BulletBase{
  constructor(color, position, right){
    if(color == 'blue')
      super(playerBlueBullet.clone());
    else if(color == 'orange')
      super(playerOrangeBullet.clone());
    this.color = color;
    this.removed = false;
    this.mesh.position.x = position.x + 0.1*right;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z - 0.2;
    GAME.root.add(this.mesh);
    this.damage = 1;
    this.initCollider();
  }

  collide(){
    let n = GAME.enemies.head;
    
    while(n != null){
      let b = n.value;
      if(!b.removed){
        if(checkCollision(this.collider, b.collider) == true){
          this.remove();
          let damage = this.damage;
          if(this.color != b.color){
            damage *= 2;
          }
          //console.log(damage);
          b.hp -= damage;
          if(b.hp <= 0){
            b.remove();
          }
        }
      }
      n = n.next;
    }
  }

  animate(){
    super.animate();
    if(!this.removed){
      this.collide();
    }
  }
}

/*
Credit - https://codepen.io/boytchev/pen/ExdmvxE
*/
function createFakeBloom(baseGeometry, {
  layers = 5,
  maxScale = 1.5,
  baseColor = 0xffaa00,
  opacityFalloff = 0.6
} = {}) {
  const bloom = new THREE.Group();

  for (let i = 0; i < 1; i += 1 / layers) {
    const scale = 1 + i * (maxScale - 1);
    const color =  baseColor;

    const mat = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 1 - Math.pow(i, opacityFalloff),
      emissive: color,
      emissiveIntensity: 1
    });

    const glowMesh = new THREE.Mesh(baseGeometry.clone(), mat);
    glowMesh.scale.setScalar(scale, scale, scale);
    bloom.add(glowMesh);
  }

  return bloom;
}
