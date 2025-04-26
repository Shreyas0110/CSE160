function drawTriangle3D(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to create buffer obj");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

class Cube extends Shape{
    constructor(position, color, size){
        super(position, color, size);
        this.type = 'cube';
        this.matrix = new Matrix4();
    }

    render(){
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.uniform4f(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
        drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
    }
}