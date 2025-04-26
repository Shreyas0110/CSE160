// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute mat4 a_ModelMatrix;
  attribute vec4 a_FragColor;
  varying vec4 v_FragColor;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ViewMatrix * a_ModelMatrix * a_Position;
    v_FragColor = a_FragColor;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_FragColor;
  void main() {
    gl_FragColor = v_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let a_FragColor;
let a_ModelMatrix;
let u_ViewMatrix;

function setupWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to intialize shaders.');
  return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  a_FragColor = gl.getAttribLocation(gl.program, 'a_FragColor');
  if (!a_FragColor) {
    console.log('Failed to get the storage location of a_FragColor');
    return;
  }

  a_ModelMatrix = gl.getAttribLocation(gl.program, 'a_ModelMatrix');
  if (!a_ModelMatrix) {
    console.log('Failed to get the storage location of a_ModelMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  let floor = new FunkyCylinder(100);
  floor.addLayer([0,0], 0, 100);
  floor.addLayer([0,0], 0.2, 220);
  floor.addPoint([0,0], 0);
  
  let vertices = floor.getVertices();
  let color = floor.getColors();
  let eye = new Matrix4();

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

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

  gl.uniformMatrix4fv(u_ViewMatrix, false, eye.elements);

  gl.vertexAttribDivisor(a_ModelMatrix, 1);

  gl.useProgram(gl.program);
  gl.bindVertexArray(vao);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, vertices.length/3, 1);
}

function convertCoordinatesToWebGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x,y];
}
