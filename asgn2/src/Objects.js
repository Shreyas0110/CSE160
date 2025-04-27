class MasterFloor extends FunkyCylinder{
    constructor(){
        super(100);
        this.addLayer([0,0], 0, 100);
        this.addLayer([0,0], 0.2, 220);
        this.addPoint([0,0], 0);
        this.initNormals();
    }
}

class instanceReference{
    constructor(matrix, color){
        this.ModelMatrix = new Matrix4(matrix);
        this.color = color;
    }

    setModelMatrix(){}
}

class FloorInstance extends instanceReference{
    constructor(){
        super(eye, [0.75, 0.75, 0.75, 1]);
    }

    setModelMatrix(matrixData, offset){
        let m = new Matrix4();
        m.rotate(180*Math.sin(g_seconds), 1, 0, 0);
        for(let i = 0; i < 16; ++i){
            matrixData[offset+i] = m.elements[i];
        }
    }
}