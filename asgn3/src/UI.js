let upperArmZ = 0;
let lowerArmZ = 0;

function addActionfromUI(){

    document.getElementById("animON").addEventListener('mouseup', function(){anim = animation_status.WALK});
    document.getElementById("animOFF").addEventListener('mouseup', function(){anim = animation_status.NONE});


    document.addEventListener("keydown", (e) => {
        let key = e.key.toLowerCase();
        switch(key){
            case 'w':
                MainCamera.startMovingForward();
                break;
            case 's':
                MainCamera.startMovingBackward();
                break;
            case 'a':
                MainCamera.startMovingLeft();
                break;
            case 'd':
                MainCamera.startMovingRight();
                break;
            case 'q':
                MainCamera.startPanLeft(3);
                break;
            case 'e':
                MainCamera.startPanRight(3);
        }
    });

    document.addEventListener("keyup", (e) => {
        let key = e.key.toLowerCase();
        switch(key){
            case 'w':
                MainCamera.stopMovingForward();
                break;
            case 's':
                MainCamera.stopMovingBackward();
                break;
            case 'a':
                MainCamera.stopMovingLeft();
                break;
            case 'd':
                MainCamera.stopMovingRight();
                break;
            case 'q':
                MainCamera.stopPanLeft();
                break;
            case 'e':
                MainCamera.stopPanRight();
        }
    });

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

    // Listen for pointer lock changes
    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas) {
            document.addEventListener('mousemove', onMouseMove);
        } else {
            document.removeEventListener('mousemove', onMouseMove);
            MainCamera.stopPanLeft();
            MainCamera.stopPanRight();
        }
    });

    function onMouseMove(e) {
        const movementX = e.movementX || 0;
        const movementY = e.movementY || 0;
        const threshold = 1; // sensitivity

        if (movementX > threshold) {
            MainCamera.stopPanLeft();
            MainCamera.startPanRight(movementX);
        } else if (movementX < -threshold) {
            MainCamera.stopPanRight();
            MainCamera.startPanLeft(-movementX);
        } else {
            MainCamera.stopPanLeft();
            MainCamera.stopPanRight();
        }

        if (movementY > threshold) {
            MainCamera.stopPanUp();
            MainCamera.startPanDown(movementY);
        } else if (movementY < -threshold) {
            MainCamera.stopPanDown();
            MainCamera.startPanUp(-movementY);
        } else {
            MainCamera.stopPanUp();
            MainCamera.stopPanDown();
        }
    }
    let mouseDown = false;
    canvas.addEventListener('mousedown', function (e) {
    if (e.button === 2 && !mouseDown) { // 0 is the left mouse button
        mouseDown = true;
        let e = MainCamera.eye.elements;
        MainCamera.computeF();
        MainCamera.f.normalize();
        MainCamera.f.mul(150);
        let f = MainCamera.f.elements;
        let b = [new instanceReference(eye, [1, 0, 0, 1], undefined, [e[0] + f[0], e[1] + f[1], e[2] + f[2]], [20,20,20], undefined, true)];
        instanceList.push(new InstanceHandler(masterCube, b, true, 2));
    }
    });

    canvas.addEventListener('mouseup', function (e) {
    if (e.button === 2) {
        mouseDown = false;
    }
    });
}