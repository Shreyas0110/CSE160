class Cube extends FunkyCylinder{
    constructor(){
        super(4);
        this.type = 'cube';
        this.addPoint([0,0], -0.2);
        this.addLayer([0,0], 0, 100);
        this.addLayer([0,0], 0.4, 100);
        this.addPoint([0,0], 0);
    }

}