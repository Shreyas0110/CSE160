goronbodycolor = [186/255.0, 148/255.0, 35/255.0, 1];

class Goron{
    constructor(color = goronbodycolor, location = [0,0,0], scale = [1, 1, 1]){
        this.location = new Vector3(location);

        //BODY
        this.bodyInstance = new GoronBodyInstance(
            eye, color, undefined,
            this.location.elements, [scale[0], scale[1], scale[2]*0.95], [0,0,0]);

        //HEAD
        this.GoronHeadInstance = new GoronHeadInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [0,45, 2], undefined, [0,0,0]
        );

        this.GoronUpperArmInstances = [];
        this.GoronLowerArmInstances = [];

        //UPPER ARMS
        this.GoronUpperArmInstances.push(new GoronUpperArmInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [-17, 40, 0], [1.1, 1.1, 1.3], [0, 0, 135]
        ));

        this.GoronUpperArmInstances.push(new GoronUpperArmInstance(
            this.bodyInstance.tempMatrix, color, undefined,
            [17, 40, 0], [1.1, 1.1, 1.3], [0, 0, -135]
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
        let angleX = 25*Math.sin(g_seconds);
        this.setAngle(angleX, 0, 0);
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
        let angleZ = 25*Math.sin(g_seconds);
        this.setAngle(0, 0, angleZ);
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
        let angleZ = 25*Math.sin(g_seconds);
        this.setAngle(0, 0, angleZ);
    }
}

class GoronUpperLegInstance extends instanceReference{

}

class GoronLowerLegInstance extends instanceReference{

}

class BasicCyliner extends FunkyCylinder{
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