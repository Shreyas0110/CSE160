// DrawTriangle.js (c) 2012 matsuda
var canvas = document.getElementById('example'); 
var ctx = canvas.getContext('2d'); 
function main() {  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  }   
  clear();
}

function clear(){
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
}

var v2, v2;

function handleDrawEvent(){
    let v1x = parseFloat(document.getElementById("v1x").value);
    let v1y = parseFloat(document.getElementById("v1y").value);
    if(isNaN(v1x) || isNaN(v1y)){
        console.log('Bad Input');
        return false;
    }
    let v2x = parseFloat(document.getElementById("v2x").value);
    let v2y = parseFloat(document.getElementById("v2y").value);
    if(isNaN(v2x) || isNaN(v2y)){
        console.log('Bad Input');
        return false;
    }
    v1 = new Vector3([v1x,v1y,0]);
    v2 = new Vector3([v2x,v2y,0]);
    clear();
    drawVector(v1, 'red');
    drawVector(v2, 'blue');
    return true;
}

function handleDrawOperationEvent(){
    if(!handleDrawEvent()){
        return;
    }
    let oldv1 = new Vector3();
    let oldv2 = new Vector3();
    oldv1.set(v1);
    oldv2.set(v2);
    if(v1 !== undefined && v2 !== undefined){
        switch(document.getElementById("operation").value){
            case "Add":
                v1.add(v2);
                drawVector(v1, 'green');
                break;
            case "Subtract":
                v1.sub(v2);
                drawVector(v1, 'green');
                break;
            case "Multiply":
                let scalar = parseFloat(document.getElementById("opValue").value);
                if(isNaN(scalar)){
                    console.log('Bad Input');
                    return false;
                }
                v1.mul(scalar);
                v2.mul(scalar);
                drawVector(v1, 'green');
                drawVector(v2, 'green');
                break;
            case "Divide":
                let scalar1 = parseFloat(document.getElementById("opValue").value);
                if(isNaN(scalar1)){
                    console.log('Bad Input');
                    return false;
                }
                v1.div(scalar1);
                v2.div(scalar1);
                drawVector(v1, 'green');
                drawVector(v2, 'green');
                break;
            case "Magnitude":
                console.log("Magnitude v1:", v1.magnitude());
                console.log("Magnitude v2:", v2.magnitude());
                break;
            case "Normalize":
                v1.normalize();
                v2.normalize();
                drawVector(v1, 'green');
                drawVector(v2, 'green');
                break;
            case "Angle between":
                var dotProduct = Vector3.dot(v1, v2);
                var magnitudes = v1.magnitude() * v2.magnitude();   
                if (magnitudes === 0) {
                    console.log("Cannot compute angle: One of the vectors has zero magnitude.");
                    break;
                }     
                var alpha = Math.acos(dotProduct / magnitudes);
                if (isNaN(alpha)) {
                    alpha = Math.PI / 2;
                }
                console.log("Angle:", alpha * (180 / Math.PI));
                break;
            case "Area":
                console.log("Area:", Vector3.cross(v1,v2).magnitude()/2);
                break;
        }
    }
    v1.set(oldv1);
    v2.set(oldv2);
}

function drawVector(v, color){
    var canvas = document.getElementById('example'); 
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200 + v.elements[0]*20, 200 - v.elements[1]*20);
    ctx.stroke();
}
