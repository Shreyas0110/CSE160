let upperArmZ = 0;
let lowerArmZ = 0;

function addActionfromUI(){
    document.getElementById("cameraAngleX").addEventListener('mousemove', function(){viewAngleX = this.value;});
    document.getElementById("cameraAngleY").addEventListener('mousemove', function(){viewAngleY = this.value;});
    document.getElementById("cameraAngleZ").addEventListener('mousemove', function(){viewAngleZ = this.value;});

    document.getElementById("cameraPosX").addEventListener('mousemove', function(){viewLocX = this.value;});
    document.getElementById("cameraPosY").addEventListener('mousemove', function(){viewLocY = this.value;});
    document.getElementById("cameraPosZ").addEventListener('mousemove', function(){viewLocZ = this.value;});

    document.getElementById("UpperArmZ").addEventListener('mousemove', function(){upperArmZ = this.value;});
    document.getElementById("LowerArmZ").addEventListener('mousemove', function(){lowerArmZ = this.value;});

    document.getElementById("animON").addEventListener('mouseup', function(){anim = animation_status.WALK});
    document.getElementById("animOFF").addEventListener('mouseup', function(){anim = animation_status.NONE});


    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', function(event) {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;

        if (event.shiftKey) {
            anim = animation_status.WAVE;
        }
    });

    canvas.addEventListener('mousemove', function(event) {
        if (isDragging) {
            let dx = event.clientX - lastX;
            let dy = event.clientY - lastY;

            lastX = event.clientX;
            lastY = event.clientY;

            const sensitivity = 0.5;

            viewAngleX += dy * sensitivity;
            viewAngleY += dx * sensitivity; 

        }
    });

    canvas.addEventListener('mouseup', function(event) {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', function(event) {
        isDragging = false;
    });
}