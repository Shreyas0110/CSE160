function addActionfromUI(){
    document.getElementById("cameraAngleX").addEventListener('mousemove', function(){viewAngleX = this.value;});
    document.getElementById("cameraAngleY").addEventListener('mousemove', function(){viewAngleY = this.value;});
    document.getElementById("cameraAngleZ").addEventListener('mousemove', function(){viewAngleZ = this.value;});

    document.getElementById("cameraPosX").addEventListener('mousemove', function(){viewLocX = this.value;});
    document.getElementById("cameraPosY").addEventListener('mousemove', function(){viewLocY = this.value;});
    document.getElementById("cameraPosZ").addEventListener('mousemove', function(){viewLocZ = this.value;});
}