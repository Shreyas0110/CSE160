goronbodycolor = [186/255.0, 148/255.0, 35/255.0, 1];

const animation_status = {
    NONE: "none",
    WAVE: "wave",
    WALK: "walk",
    DANCE: "dance"
};

let anim = animation_status.WALK;

var goronPos = [-10000, -100000, -10000];

class Goron{
    constructor(color = goronbodycolor, location = [0,0,0], scale = [1, 1, 1]){
        goronPos = location;
        this.location = new Vector3(location);

        //BODY
        this.bodyInstance = new GoronBodyInstance(
            eye, color, undefined,
            this.location.elements, [scale[0], scale[1], scale[2]*0.95], [0,0,0]);

        //HEAD
        this.GoronHeadInstance = new GoronHeadInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [0,43, 2], [1.1, 1.1, 1.1], [0,0,0]
        );

        this.GoronUpperArmInstances = [];
        this.GoronLowerArmInstances = [];

        //UPPER ARMS
        this.GoronUpperArmInstances.push(new GoronUpperArmInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [-16, 40, 0], [1.6, 1.4, 1.4], [0, 0, 135]
        ));

        this.GoronUpperArmInstances.push(new GoronUpperArmInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [16, 40, 0],  [1.6, 1.4, 1.4], [0, 0, -135]
        ));

        //UPPER LEGS
        this.GoronUpperArmInstances.push(new GoronUpperLegInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [-10, 5, 0], [1.3, 1.3, 1.3], [0, 0, 180]
        ));

        this.GoronUpperArmInstances.push(new GoronUpperLegInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [10, 5, 0], [1.3, 1.3, 1.3], [0, 0, 180]
        ));

        //LOWER ARMS
        this.GoronLowerArmInstances.push(new GoronLowerArmInstance(
            this.GoronUpperArmInstances[0].tempMatrix, color, undefined,
            [0, 13, 0], [1, 1, 1], [0, 0, 0]
        ));
        this.GoronLowerArmInstances.push(new GoronLowerArmInstance(
            this.GoronUpperArmInstances[1].tempMatrix, color, undefined,
            [0, 13, 0], [1, 1, 1], [0, 0, 0]
        ));

        //LOWER LEGS
        this.GoronLowerArmInstances.push(new GoronLowerLegInstance(
            this.GoronUpperArmInstances[2].tempMatrix, color, undefined,
            [0, 13, 0], [1, 0.7, 1], [0, 0, 0]
        ));
        this.GoronLowerArmInstances.push(new GoronLowerLegInstance(
            this.GoronUpperArmInstances[3].tempMatrix, color, undefined,
            [0, 13, 0], [1, 0.7, 1], [0, 0, 0]
        ));

        //HORN

        let hornColor = [Math.min(1, color[0] + (216-goronbodycolor[0])/255), Math.min(1, color[1] + (210-goronbodycolor[1])/255), Math.min(1, color[2] + (113-goronbodycolor[2])/255), 1];
        this.GoronHornInstances = [];
        this.GoronHornInstances.push(new GoronHornInstance(
            this.GoronHeadInstance.tempMatrix, hornColor, undefined,
            [0, 15.2, 0], [1,1,1], [0,0,0]
        ));

        this.cylinders = [];

        //eye base
        this.cylinders.push(new CylinderInstance(
            this.GoronHeadInstance.tempMatrix, [0.1,0.1,0.1,1], undefined,
            [-5, 10, 8.6], [0.5,0.2,0.5], [55,-25,0]
        ));

        this.cylinders.push(new CylinderInstance(
            this.GoronHeadInstance.tempMatrix, [0.1,0.1,0.1,1], undefined,
            [5, 10, 8.6], [0.5,0.2,0.5], [55,25,0]
        ));

        //iris
        let iriscolor = [153/255,50/255,204/255, 1];
        this.cylinders.push(new CylinderInstance(
            this.cylinders[0].tempMatrix, iriscolor, undefined,
            [0, 1, 0], [0.7,0.2,0.7], [0,0,0]
        ));

        this.cylinders.push(new CylinderInstance(
            this.cylinders[1].tempMatrix, iriscolor, undefined,
            [0, 1, 0], [0.7,0.2,0.7], [0,0,0]
        ));

        //pupil
        this.cylinders.push(new CylinderInstance(
            this.cylinders[0].tempMatrix, [0.1, 0.1, 0.1, 1], undefined,
            [0, 1.5, 1], [0.3,0.2,0.3], [0,0,0]
        ));

        this.cylinders.push(new CylinderInstance(
            this.cylinders[1].tempMatrix, [0.1, 0.1, 0.1, 1], undefined,
            [0, 1.5, 1], [0.3,0.2,0.3], [0,0,0]
        ));

        //eye light
        this.cylinders.push(new CylinderInstance(
            this.cylinders[0].tempMatrix, [1, 1, 1, 1], undefined,
            [-1, 1.5, -1.5], [0.2,0.2,0.2], [0,0,0]
        ));

        this.cylinders.push(new CylinderInstance(
            this.cylinders[1].tempMatrix, [1, 1, 1, 1], undefined,
            [-1, 1.5, -1.5], [0.2,0.2,0.2], [0,0,0]
        ));

        //nose
        this.cylinders.push(new CylinderInstance(
            this.GoronHeadInstance.tempMatrix, [0.1, 0.1, 0.1, 1], undefined,
            [-1, 7, 11], [0.1,0.1,0.15], [60,0,-45]
        ));
        this.cylinders.push(new CylinderInstance(
            this.GoronHeadInstance.tempMatrix, [0.1, 0.1, 0.1, 1], undefined,
            [1, 7, 11], [0.1,0.1,0.15], [60,0,45]
        ));

        //mouth
        this.cylinders.push(new CylinderInstance(
            this.GoronHeadInstance.tempMatrix, [177/255,114/255,97/255,1], undefined,
            [0, 4, 9.5], [1.3,0.9,0.7], [0,0,0]
        ));



        //belly button
        this.cylinders.push(new CylinderInstance(
            this.bodyInstance.tempMatrix, [0.1,0.1,0.1,1], undefined,
            [0, 10, 20], [0.3,0.2,0.3], [110,0,0]
        ));

        anim = animation_status.WALK;


    }

    teleport(){
        let x = -640 + Math.random() * 1280;
        let y = 30;
        let z = -640 + Math.random() * 1280;
        goronPos = [x,y,z];
        this.bodyInstance.translateP = [x, y, z];
    }
}

class GoronBodyMaster extends FunkyCylinder{
    constructor(){
        super(100);
        this.addPoint([0,0], 0);
        this.addLayer([0,0], 2, 12);
        this.addLayer([0,0], 4, 17);
        this.addLayer([0,1], 2, 18);
        this.addLayer([0,1.5], 3, 18.5);
        this.addLayer([0,1.5], 5, 20);
        this.addLayer([0,1.5], 5, 21);
        this.addLayer([0,1.5], 5, 20);
        this.addLayer([0,1], 6, 17);
        this.addLayer([0,1], 4, 18);
        this.addLayer([0,0], 4, 17);
        this.addLayer([0,0], 2, 15);

        this.addPoint([0,-4], 10);

        this.initNormals();
    }
}

class GoronBodyInstance extends instanceReference{
    animate(){
        let angleX = 0;
        let angleY = 0;
        let angleZ = 0;
        if (anim != animation_status.WALK){
            this.translateP[1] = this.dy;
        }
        switch (anim){
            case animation_status.WALK:
                //if(g_seconds > this.anim_end){
                    //this.anim_end = g_seconds + 3;
                    //this.translateP[1] = this.dy;
                    //angleY = Math.random()*360;
                //}
                angleX = -10*Math.sin(2*g_seconds);
                this.translateP[1] += 0.4*Math.cos(2*g_seconds);
                break;
                
        }
        this.setAngle(angleX, angleY, angleZ);
    }
}

class GoronHeadMaster extends FunkyCylinder{
    constructor(){
        super(10);
        this.addPoint([0,0], 0);
        this.addLayer([0,0], 2, 10);
        this.addLayer([0,0], 2, 13);
        this.addLayer([0,0], 6, 10);
        this.addLayer([0,0], 5, 6);
        this.addPoint([0,0], 4);
        this.initNormals();
    }
}

class GoronHeadInstance extends instanceReference{
}

class GoronUpperArmMaster extends FunkyCylinder{
    constructor(){
        super(6);
        this.addPoint([0,0], 0);
        this.addLayer([0,0], 1.5, 2);
        this.addLayer([0,0], 3.5, 4);
        this.addLayer([0,0], 2.5, 3.5);
        this.addLayer([0,0], 3.5, 3);
        this.addLayer([0,0], 2.5, 2.5);
        this.addPoint([0,0], 1.5);
        this.initNormals();
    }
}

class GoronUpperArmInstance extends instanceReference{
    animate(){
        let angleX = 0;
        let angleY = 0;
        let angleZ = 0;
        switch (anim){
            case animation_status.WAVE:
                angleZ = 25*Math.sin(3*g_seconds * Math.sign(this.translateP[0])) + 90 * Math.sign(this.translateP[0]) ;
                break;
            case animation_status.NONE:
                angleZ = upperArmZ;
                break;
            case animation_status.WALK:
                angleZ = -(160-135)* Math.sign(this.translateP[0]);
                angleX = 60*Math.sin(2*g_seconds * Math.sign(this.translateP[0]));
                break;
        }
        this.setAngle(angleX, angleY, angleZ);
    }

}

class GoronLowerArmMaster extends FunkyCylinder{
    constructor(){
        super(6);
        this.addPoint([0,0], 0);
        this.addLayer([0,0], 2, 2.5);
        this.addLayer([0,0], 8, 3);
        this.addLayer([0,0], 8, 2);
        this.addPoint([0,0], 2);
        this.initNormals();
    }
}

class GoronLowerArmInstance extends instanceReference{
    animate(){
        let angleX = 0;
        let angleY = 0;
        let angleZ = 0;
        switch (anim){
            case animation_status.WAVE:
                angleZ = 15*Math.sin(3*g_seconds * Math.sign(this.parentMatrix.elements[4]));
                break;
            case animation_status.NONE:
                angleZ = lowerArmZ;
                break;
            case animation_status.WALK:
                angleX = 25*Math.sin(2*g_seconds * Math.sign(this.parentMatrix.elements[4]))+25;
                break;
        }
        this.setAngle(angleX, angleY, angleZ);
    }
}

class GoronUpperLegInstance extends instanceReference{
    animate(){
        let angleX = 0;
        let angleY = 0;
        let angleZ = 0;
        switch (anim){
            case animation_status.WALK:
                angleX = 60*Math.sin(2*g_seconds * Math.sign(this.translateP[0]));
                break;
        }
        this.setAngle(angleX, angleY, angleZ);
    }

}

class GoronLowerLegInstance extends instanceReference{
    animate(){
        let angleX = 0;
        let angleY = 0;
        let angleZ = 0;
        switch (anim){
            case animation_status.WALK:
                angleX = 25*Math.sin(2*g_seconds * Math.sign(this.parentMatrix.elements[4]))-25;
                break;
        }
        this.setAngle(angleX, angleY, angleZ);
    }

}

class BasicCylinder extends FunkyCylinder{
    constructor(){
        super(50);
        this.addPoint([0,0], -1);
        this.addLayer([0,0], 0, 5);
        this.addLayer([0,0], 2, 5);
        this.addPoint([0,0], 0);
        this.initNormals();
    }
}

class CylinderInstance extends instanceReference{

}

class GoronHornMaster extends FunkyCylinder{
    constructor(){
        super(10);
        this.addPoint([0,0], 0);
        this.addLayer([0,0], 0, 6.01);
        this.addPoint([0,0], 4.01);
        this.initNormals();
    }
}

class GoronHornInstance extends instanceReference{
    animate(){
        if (this.render == true){
            super.animate();
        } else{
            this.tempMatrix.elements =
                [0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0];
        }
    }

}