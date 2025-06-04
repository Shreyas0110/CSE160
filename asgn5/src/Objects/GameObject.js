import { GAME } from "../gameState";
import { SphereCollider, EllipseCollider, BoxCollider } from '../collisions';

export class GameObject{
    constructor(Mesh){
        this.mesh = Mesh;
        this.removed = false;
    }

    animate(){

    }
    
    setMesh(Mesh){
        this.mesh = Mesh;
    }

    remove(){
        GAME.root.remove(this.mesh);
        //this.mesh.dispose();
        this.removed = true;
    }

    initCollider(){
      let mesh = this.mesh;
      if(mesh.scale.x != mesh.scale.y){
          this.collider = new EllipseCollider(mesh.position, mesh.scale.x, mesh.scale.y, mesh.scale.z);
      } else{
          this.collider = new SphereCollider(mesh.position, mesh.scale.x);
      }
  }
}