

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
}