class InstanceHandler{
    constructor(base, instances, hasLight=true, whichTexture = 0){
        this.createVAO(base, instances);
        this.object = base;
        this.numInstances = instances.length;
        this.instances = instances;
        this.matrixData = new Float32Array(16*this.numInstances);
        this.normalMatrixData = new Float32Array(16*this.numInstances);
        this.hasLight = hasLight;
        this.whichTexture = whichTexture;
    }

    createVAO(object, instances){
        let vertices = object.getVertices();
        let normals = object.normals;
        let matrices = instances.flatMap(item => Array.from(item.tempMatrix.elements));
        let normalmatrices = instances.flatMap(item => Array.from(item.normalMatrix.elements));
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
        
        let m = [a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3]
        for (let i = 0; i < 4; ++i) {
          let loc = m[i];
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 64, i * 16);
          gl.vertexAttribDivisor(loc, 1);
        }

        const normalMatrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalMatrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalmatrices), gl.DYNAMIC_DRAW);

        let n = [a_normalMatrix0, a_normalMatrix1, a_normalMatrix2, a_normalMatrix3]
        for (let i = 0; i < 4; ++i) {
          let loc = n[i];
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
        this.normalMatrixBuffer = normalMatrixBuffer
        this.length = vertices.length;

    }

    renderInstance(){
        let offset = 0;
        for(let instance of this.instances){
            instance.setModelMatrix(this.matrixData, this.normalMatrixData, offset);
            offset += 16;
        }
        let t = this.whichTexture;
        if(normalsOn){
            t = -1;
        }

        //console.log(this.matrixData);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.modelMatrixBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.matrixData);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalMatrixBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.normalMatrixData);

        gl.uniform1i(u_UseLighting, this.hasLight);
        gl.uniform1i(u_UseTexture, t);
        if(this.whichTexture == 1){
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex1);
        }else if(this.whichTexture == 2){
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, tex2);
        }

        gl.bindVertexArray(this.vao);
      
        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.length/3, this.numInstances);
    }

}