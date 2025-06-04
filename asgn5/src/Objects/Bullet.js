import * as THREE from 'three'
import { GAME } from '../gameState'
import { GameObject } from './GameObject'
import { SphereCollider, EllipseCollider, BoxCollider } from '../collisions';

let playerBlueBullet;
let ellipseBulletGeom;

export function initBullets(){
  ellipseBulletGeom = new THREE.SphereGeometry();
  ellipseBulletGeom.scale(0.04,0.04,0.12);
  playerBlueBullet = createFakeBloom(ellipseBulletGeom, {baseColor: 0x0096FF});
}

class BulletBase extends GameObject{
  initCollider(){
    let mesh = this.mesh;
    if(mesh.scale.x != mesh.scale.y){
      this.collider = EllipseCollider(mesh.position, mesh.scale.x, mesh.scale.y, mesh.scale.z);
    }
  }
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
  remove(){
    GAME.root.remove(this.mesh);
    //this.mesh.dispose();
    this.removed = true;
  }
}

export class PlayerBullet extends BulletBase{
  constructor(color, position, right){
    if(color == 'blue')
      super(playerBlueBullet.clone());
    this.removed = false;
    this.mesh.position.x = position.x + 0.1*right;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z - 0.2;
    GAME.root.add(this.mesh);
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
