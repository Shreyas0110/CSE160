class Goron{
    constructor(){
        
    }
}

class GoronBodyMaster extends FunkyCylinder{
    constructor(){
        this.addPoint([0,0], 0);
        this.addLayer([0,0.1], 0.1, 100);
    }
}

class GoronBodyInstance extends instanceReference{

}