let zSensitivity = 100000;
let xSensitivity = 60000;

let rotationSensitivity = 1000;
let goronCaught = 0;

class Camera{
    constructor(eye = [0,120,500], at = [0,30,-1], up = [0,1,0]){
        this.perspectiveMatrix = new Matrix4().setPerspective(40, canvas.clientWidth / canvas.clientHeight, .1, 6000);
        this.eye = new Vector3(eye);
        this.at = new Vector3(at);
        this.up = new Vector3(up);
        this.matrix = new Matrix4();
        this.viewMatrix = new Matrix4();
        this.f = new Vector3();
        this.tempVector = new Vector3();
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.panningLeft = false;
        this.panningRight = false;
        this.panningUp = false;
        this.panningDown = false;
    }
    getCameraMatrix(){
        let zspeed = zSensitivity * duration/1000;
        let xspeed = xSensitivity * duration/1000;
        let panSpeed = rotationSensitivity * duration/1000;
        if(this.forward){
            this.moveForward(zspeed);
        } else if(this.backward){
            this.moveBackwards(zspeed);
        }
        if(this.left){
            this.moveLeft(xspeed);
        } else if(this.right){
            this.moveRight(xspeed);
        }
        if(this.panningLeft){
            this.panLeft(panSpeed*this.leftPan);
        } else if(this.panningRight){
            this.panRight(panSpeed*this.rightPan);
        }
        if(this.panningUp){
            this.panUp(panSpeed*this.upPan);
        } else if(this.panningDown){
            this.panDown(panSpeed*this.downPan);
        }
        let eye = this.eye.elements;
        let t = 50;
        if(Math.abs(eye[0] - goronPos[0]) <= t && Math.abs(eye[1] - goronPos[1]) <= t && Math.abs(eye[2] - goronPos[2]) <= t){
            goronCaught++;
            sendTextToHTML("Number of times Goron has been caught: " + goronCaught, "gcount");
            gorons[0].teleport();
        }
        let at = this.at.elements;
        let up = this.up.elements;
        this.matrix.set(this.perspectiveMatrix);
        this.viewMatrix.setLookAt(eye[0], eye[1], eye[2], at[0], at[1], at[2], up[0], up[1], up[2]);
        this.matrix.multiply(this.viewMatrix);
        return this.matrix;
    }
    computeF(){
        this.f.set(this.at);
        this.f.sub(this.eye);
    }

    moveForward(speed){
        this.computeF();
        this.f.normalize();
        this.f.mul(speed);
        this.eye.add(this.f);
        this.at.add(this.f);
    }

    moveBackwards(speed){
        this.computeF();
        this.f.normalize();
        this.f.mul(speed);
        this.eye.sub(this.f);
        this.at.sub(this.f);
    }

    moveLeft(speed){
        this.computeF();
        Vector3.cross(this.up, this.f, this.tempVector);
        
        this.tempVector.normalize();
        
        this.tempVector.mul(speed);
        this.eye.add(this.tempVector);
        this.at.add(this.tempVector);
    }

    moveRight(speed){
        this.computeF();
        Vector3.cross(this.f, this.up, this.tempVector);
        this.tempVector.normalize();
        this.tempVector.mul(speed);
        this.eye.add(this.tempVector);
        this.at.add(this.tempVector);
    }

    panLeft(alpha = 5){
        this.computeF();
        this.matrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.matrix.multiplyVector3(this.f, this.tempVector);
        this.tempVector.add(this.eye);
        this.at.set(this.tempVector);
    }

    panRight(alpha = 5){
        this.computeF();
        this.matrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.matrix.multiplyVector3(this.f, this.tempVector);
        this.tempVector.add(this.eye);
        this.at.set(this.tempVector);
    }

    panUp(alpha = 5) {
        this.computeF();
        Vector3.cross(this.f, this.up, this.tempVector)
        this.tempVector.normalize();
        this.matrix.setRotate(alpha, this.tempVector.elements[0], this.tempVector.elements[1], this.tempVector.elements[2]);
        this.matrix.multiplyVector3(this.f, this.tempVector);
        this.tempVector.add(this.eye);
        this.at.set(this.tempVector);
    }

    panDown(alpha){
        this.computeF();
        Vector3.cross(this.f, this.up, this.tempVector)
        this.tempVector.normalize();
        this.matrix.setRotate(-alpha, this.tempVector.elements[0], this.tempVector.elements[1], this.tempVector.elements[2]);
        this.matrix.multiplyVector3(this.f, this.tempVector);
        this.tempVector.add(this.eye);
        this.at.set(this.tempVector);
    }

    startMovingForward(){
        this.forward = true;
    }
    stopMovingForward(){
        this.forward = false;
    }
    startMovingBackward(){
        this.backward = true;
    }
    stopMovingBackward(){
        this.backward = false;
    }
    startMovingLeft(){
        this.left = true;
    }
    startMovingRight(){
        this.right = true;
    }
    stopMovingLeft(){
        this.left = false;
    }
    stopMovingRight(){
        this.right = false;
    }
    startPanLeft(amt){
        this.leftPan = amt;
        this.panningLeft = true;
    }
    stopPanLeft(){
        this.panningLeft = false;
    }
    startPanRight(amt){
        this.rightPan = amt;
        this.panningRight = true;
    }
    stopPanRight(){
        this.panningRight = false;
    }

    startPanUp(amt){
        this.upPan = amt;
        this.panningUp = true;
    }
    
    startPanDown(amt){
        this.downPan = amt;
        this.panningDown = true;
    }

    stopPanUp(){
        this.panningUp = false;
    }

    stopPanDown(){
        this.panningDown = false;
    }
    
}