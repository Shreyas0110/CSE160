class Shape{
    constructor(position, color, size){
        this.type = '';
        this.position = position;
        this.color = color;
        this.size = size; 
    }

    render(){};
}

class Point extends Shape{
    constructor(position, color, size){
        super(position, color, size);
        this.type = 'point';
    }
    render(){
        
        gl.disableVertexAttribArray(a_Position);
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
        gl.uniform1f(u_Size, this.size);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

class Triangle extends Shape{
    constructor(position, color, size){
        super(position, color, size);
        this.type = 'triangle';
    }

    render(){
        gl.uniform1f(u_Size, this.size);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        var d = this.size/200.0;
        var xy = this.position;
        drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0]+d/2, xy[1]+d])
    }
}

function drawTriangle(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to create buffer obj");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

class Circle extends Shape{
    constructor(position, color, size, segments){
        super(position, color, size);
        this.segments = segments;
        this.type = 'circle';
    }

    render(){
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        var d = this.size/400.0;
        var xy = this.position;

        let angleStep = 360/this.segments;
        for(var angle = 0; angle < 360; angle = angle+angleStep){
            let centerPt = [xy[0], xy[1]];
            let angle1=angle;
            let angle2=angle+angleStep;
            let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
        }
    }
}