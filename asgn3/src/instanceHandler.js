class InstanceHandler{
    constructor(base, instances, hasLight=true, whichTexture = 0){
        this.createVAO(base, instances);
        this.object = base;
        this.numInstances = instances.length;
        this.instances = instances;
        this.matrixData = new Float32Array(16*this.numInstances);
        this.hasLight = hasLight;
        this.whichTexture = whichTexture;
    }

    createVAO(object, instances){
        let vertices = object.getVertices();
        let normals = object.normals;
        let matrices = instances.flatMap(item => Array.from(item.tempMatrix.elements));
        let colors = instances.flatMap(item => item.color);
/*
        for (let instance of instances){
            console.log(instance);
            matrices.push(...instance.tempMatrix.elements);
            colors.push(...instance.color);
        }*/
      
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

        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.uvs), gl.STATIC_DRAW)
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);
      
        const modelMatrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, modelMatrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(matrices), gl.DYNAMIC_DRAW);
      
        for (let i = 0; i < 4; ++i) {
          const loc = a_ModelMatrix + i;
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 64, i * 16);
          gl.vertexAttribDivisor(loc, 1);
        }
      
        const fragBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, fragBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
      
        gl.vertexAttribPointer(a_FragColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_FragColor);
        gl.vertexAttribDivisor(a_FragColor, 1);
      
        this.vao = vao;
        this.modelMatrixBuffer = modelMatrixBuffer;
        this.length = vertices.length;

    }

    renderInstance(){
        let offset = 0;
        for(let instance of this.instances){
            instance.setModelMatrix(this.matrixData, offset);
            offset += 16;
        }

        //console.log(this.matrixData);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.modelMatrixBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.matrixData);
        gl.uniform1i(u_UseLighting, this.hasLight);
        gl.uniform1i(u_UseTexture, this.whichTexture);

        gl.bindVertexArray(this.vao);
      
        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.length/3, this.numInstances);
    }

}