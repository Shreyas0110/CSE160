class MasterFloor extends FunkyCylinder{
    constructor(){
        super(500);
        this.addPoint([0,0], -10);
        this.addLayer([0,0], 0, 5000);
        this.addLayer([0,0], 10, 5000);
        this.addPoint([0,0], 0);
        this.initNormals();
    }
}

class instanceReference{
    constructor(parentMatrix = eye, color, translateR=[0,0,0], translateP=[0,0,0], scale = [1,1,1], baseAngle = [0,0,0], light = true){
        this.parentMatrix = parentMatrix;
        this.color = color;
        this.tempMatrix = new Matrix4();
        this.angleX = 0;
        this.angleY = 0;
        this.angleZ = 0;
        this.baseAngle = baseAngle;
        this.translateR = translateR;
        this.translateP = translateP;
        this.scale = scale;
        this.dy = translateP[1];
        this.render = true;
        this.anim_end = 0;
        this.hasLighting = light;
        this.uvs = null;
        this.normalMatrix = new Matrix4()
    }

    setModelMatrix(matrixData, normalMatrixData, offset){
        this.tempMatrix.set(this.parentMatrix);

        this.animate();
        this.translateForPosition();

        this.rotate();
        this.translateForRotation();
        this.scaleTransform();
/*
        this.animate();
        this.translateForRotation();
        this.rotate();
        this.scaleTransform();
        this.translateForPosition();*/
        this.normalMatrix.setInverseOf(this.tempMatrix).transpose()
        this.uploadData(matrixData, normalMatrixData, offset);
    }

    setAngle(angleX=0, angleY=0, angleZ=0){
        this.angleX = this.baseAngle[0] + angleX;
        this.angleY = this.baseAngle[1] + angleY;
        this.angleZ = this.baseAngle[2] + angleZ;
    }

    setBaseAngle(baseAngle = [0,0,0]){
        this.baseAngle = baseAngle;
    }

    animate(){
        this.setAngle();
    }

    rotate(){
        if(this.angleZ != 0){
            this.tempMatrix.rotate(this.angleZ, 0, 0, 1);
        }
        if(this.angleY != 0){
            this.tempMatrix.rotate(this.angleY, 0, 1, 0);
        }
        if(this.angleX != 0){
            this.tempMatrix.rotate(this.angleX, 1, 0, 0);
        }
    }

    translateForRotation(){
        let x = this.translateR[0];
        let y = this.translateR[1];
        let z = this.translateR[2];
        if(x != 0 || y !=0 || z != 0){
            this.tempMatrix.translate(x, y, z);
        }
    }

    translateForPosition(){
        let x = this.translateP[0];
        let y = this.translateP[1];
        let z = this.translateP[2];
        if(x != 0 || y !=0 || z != 0){
            this.tempMatrix.translate(x, y, z);
        }
    }

    uploadData(matrixData, normalMatrixData, offset){
        for(let i = 0; i < 16; ++i){
            matrixData[offset+i] = this.tempMatrix.elements[i];
            normalMatrixData[offset+i] = this.normalMatrix.elements[i];
        }
    }

    setScale(x = 0, y = 0, z = 0){
        this.scale[0] = x;
        this.scale[1] = y;
        this.scale[2] = z;
    }

    scaleTransform(){
        let x = this.scale[0];
        let y = this.scale[1];
        let z = this.scale[2];
        if(x != 0 || y !=0 || z != 0){
            this.tempMatrix.scale(x, y, z);
        }
    }
}

class FloorInstance extends instanceReference{

    animate(){
    }
}

let lightPos = [0,150, 100]

class LightReference extends instanceReference{
    animate(){
        let x = lightX/.5 - 100;
        let y = lightY/.5 + 50;
        let z = lightZ/.5;
        if(lightAnim){
            x = 150*Math.cos(g_seconds);
        }
        lightPos = [x,y,z];
        this.translateP = lightPos;
    }
}

class Model{
    constructor(filePath) {
        this.filePath = filePath;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.loader = new OBJLoader(this.filePath);
        this.loaded = false;

        this.loader.parseModel().then(() => {
            this.modelData = this.loader.getModelData();
            this.vertices = this.modelData.vertices;
            this.normals = this.modelData.normals;
            this.uvs = [];
            for (let i = 0; i < this.vertices.length; ++i){
                this.uvs.push(0,0);
            }
            this.loaded = true;
        });
    }

    getVertices(){
        return this.vertices;
    }
}