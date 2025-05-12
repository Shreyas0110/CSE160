// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

//ADD uniforms for fake lighting, texture

var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute mat4 a_ModelMatrix;

  attribute vec4 a_FragColor;
  varying vec4 v_FragColor;
  attribute vec3 a_Normal;
  varying vec3 v_Normal;

  uniform mat4 u_ViewMatrix;

  attribute vec2 a_UV;
  varying vec2 v_UV;

  void main() {
    gl_Position = u_ViewMatrix * a_ModelMatrix * a_Position;
    v_FragColor = a_FragColor;
    v_Normal = mat3(u_ViewMatrix * a_ModelMatrix) * a_Normal;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_FragColor;
  varying vec3 v_Normal;
  uniform vec3 u_reverseLightDirection;
  uniform bool u_UseLighting;
  varying vec2 v_UV;
  uniform int u_UseTexture; 
  uniform sampler2D u_Sampler;

  void main() {
    gl_FragColor = v_FragColor;

    if (u_UseTexture == 1) {
      gl_FragColor = texture2D(u_Sampler, v_UV);
    }

    if(u_UseLighting){
      vec3 normal = normalize(v_Normal);
 
      float light = dot(normal, u_reverseLightDirection);
    
      gl_FragColor.rgb *= max((light/2.0 + 0.5), 0.6);
    }
  }`;

let canvas;
let gl;
let a_Position;
let a_FragColor;
let a_ModelMatrix;
let u_ViewMatrix;
let a_Normal;
let u_reverseLightDirection;
let eye = new Matrix4();
let MainCamera;
let u_UseLighting;
let u_UseTexture;
let u_Sampler;
let a_UV;

function setupWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

  u_reverseLightDirection = gl.getUniformLocation(gl.program, 'u_reverseLightDirection');
  if (!u_reverseLightDirection) {
    console.log('Failed to get the storage location of u_reverseLightDirection');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (!a_ModelMatrix) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_UseLighting = gl.getUniformLocation(gl.program, 'u_UseLighting');
  u_UseTexture = gl.getUniformLocation(gl.program, 'u_UseTexture');
  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  loadTexture(dirt);
}

let light = (new Vector3([0.5, 0.7, 1])).normalize().elements;

function render(){
  let ViewMatrix = MainCamera.getCameraMatrix();
  gl.uniformMatrix4fv(u_ViewMatrix, false, ViewMatrix.elements);
  gl.uniform3fv(u_reverseLightDirection, light);

  gl.useProgram(gl.program);

  for(let i = 0; i < instanceList.length; ++i){
    instanceList[i].renderInstance();
  }

}

function tick(){
  var startTime = performance.now();
  g_seconds = startTime/1000.0 - g_startTime;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  render();

  duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: "+ Math.floor(1000/duration), "numdot");

  requestAnimationFrame(tick);
}

var duration;
var floor;
var instanceList = [];
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function main() {

  setupWebGL();

  connectVariablesToGLSL();
  addActionfromUI();
  // Specify the color for clearing <canvas>
  MainCamera = new Camera();
  gl.clearColor(173/255.0, 216/255.0, 230/255.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  floor = new MasterFloor();
  let mainfloor = new FloorInstance(eye, [1, 1, 1, 1], undefined, [0, 0, 0]);


  let masterBody = new GoronBodyMaster();
  let masterHead = new GoronHeadMaster();
  let masterUpperArm = new GoronUpperArmMaster();
  let masterLowerArm = new GoronLowerArmMaster();
  let masterHorn = new GoronHornMaster();
  let masterCylinder = new BasicCylinder();
  let masterCube = new Cube();

  let gorons = [];

  gorons.push(new Goron(undefined, [0, 30, 0]));
  let skyCube = new instanceReference(eye, [0.5, 0.5, 0.5, 1], undefined, [0,4,0], [2000,2000,2000], undefined, false);

  //instanceList.push(new InstanceHandler(floor, [mainfloor]));
  instanceList.push(new InstanceHandler(masterCube, [skyCube], true, 1));
  
  instanceList.push(new InstanceHandler(masterBody, gorons.map(item => item.bodyInstance)));
  instanceList.push(new InstanceHandler(masterHead, gorons.map(item => item.GoronHeadInstance)));
  instanceList.push(new InstanceHandler(masterUpperArm, gorons.flatMap(item => item.GoronUpperArmInstances)));
  instanceList.push(new InstanceHandler(masterLowerArm, gorons.flatMap(item => item.GoronLowerArmInstances)));
  instanceList.push(new InstanceHandler(masterHorn, gorons.flatMap(item => item.GoronHornInstances)));
  instanceList.push(new InstanceHandler(masterCylinder, gorons.flatMap(item => item.cylinders)));

  requestAnimationFrame(tick);

}

function convertCoordinatesToWebGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x,y];
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID);
  }
  htmlElm.innerHTML = text;
}