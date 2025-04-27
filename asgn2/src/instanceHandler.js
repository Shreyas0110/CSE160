class InstanceHandler{
    constructor(object){
        this.createVAO(object);
        this.object = object;
        this.numInstances = 1;
    }

    createVAO(object){
        let vertices = object.getVertices();
        let color = object.color;
        let normals = object.normals;
      
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
      
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);
      
        const modelMatrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, modelMatrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, eye.elements, gl.DYNAMIC_DRAW);
      
        for (let i = 0; i < 4; ++i) {
          const loc = a_ModelMatrix + i;
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 64, i * 16);
          gl.vertexAttribDivisor(loc, 1);
        }
      
        const fragBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, fragBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.DYNAMIC_DRAW);
      
        gl.vertexAttribPointer(a_FragColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_FragColor);
        gl.vertexAttribDivisor(a_FragColor, 1);
      
        this.vao = vao;
        this.modelMatrixBuffer = modelMatrixBuffer;
        this.length = vertices.length;
    }

    renderInstance(){
        this.setModelMatrix();
        gl.bindVertexArray(this.vao);
      
        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.length/3, this.numInstances);
    }

    setModelMatrix(){
        let m = new Matrix4();
        m.rotate(90*Math.sin(g_seconds), 1, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.modelMatrixBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, m.elements);
    }
}