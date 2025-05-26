// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
  attribute vec3 a_Position;
  attribute vec4 a_ModelMatrix0;
  attribute vec4 a_ModelMatrix1;
  attribute vec4 a_ModelMatrix2;
  attribute vec4 a_ModelMatrix3;

  attribute vec4 a_normalMatrix0;
  attribute vec4 a_normalMatrix1;
  attribute vec4 a_normalMatrix2;
  attribute vec4 a_normalMatrix3;

  attribute vec4 a_FragColor;
  varying vec4 v_FragColor;
  attribute vec3 a_Normal;
  varying vec3 v_Normal;

  uniform mat4 u_ViewMatrix;
  varying vec3 v_VertPos;

  attribute vec2 a_UV;
  varying vec2 v_UV;

  void main() {
    mat4 a_ModelMatrix = mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3);
    mat4 normalMatrix = mat4(a_normalMatrix0, a_normalMatrix1, a_normalMatrix2, a_normalMatrix3);
    gl_Position = u_ViewMatrix * a_ModelMatrix * vec4(a_Position, 1);
    v_FragColor = a_FragColor;
    v_Normal = normalize(vec3(normalMatrix * vec4(a_Normal, 1)));
    v_UV = a_UV;
    v_VertPos = vec3(a_ModelMatrix * vec4(a_Position, 1));
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_FragColor;
  varying vec3 v_Normal;
  uniform bool u_UseLighting;
  varying vec2 v_UV;
  uniform int u_UseTexture; 
  uniform sampler2D u_Sampler;
  uniform sampler2D u_Sampler2;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_GlobalLighting;
  varying vec3 v_VertPos;

  uniform vec3 u_LightColor;


  void main() {
    gl_FragColor = v_FragColor;

    if (u_UseTexture == -1){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }

    else if (u_UseTexture == 1) {
      gl_FragColor = texture2D(u_Sampler, v_UV);
    } else if(u_UseTexture == 2){
     gl_FragColor = texture2D(u_Sampler2, v_UV);
    }

    if(u_UseLighting && u_UseTexture != -1 && u_GlobalLighting) {
      vec3 lightVector = u_lightPos - v_VertPos;
      float r=length(lightVector);

      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N,L), 0.0);

      vec3 R = reflect(-L,N);

      vec3 E = normalize(u_cameraPos-v_VertPos);

      float specular = pow(max(dot(E,R), 0.0), 32.0);
      vec3 specularReal = specular * u_LightColor;

      vec3 diffuse = vec3(gl_FragColor) * nDotL *0.7 * u_LightColor;
      vec3 ambient = vec3(gl_FragColor) * 0.3 * u_LightColor;
    
      gl_FragColor.rgb = diffuse + ambient + specularReal;
    }
  }`;

let u_lightColor;
let u_lightPos;
let u_GlobalLighting;
let u_cameraPos;
let canvas;
let gl;
let a_Position;
let a_FragColor;
let a_ModelMatrix0;
let a_ModelMatrix1;
let a_ModelMatrix2;
let a_ModelMatrix3;
let a_normalMatrix0;
let a_normalMatrix1;
let a_normalMatrix2;
let a_normalMatrix3;
let u_ViewMatrix;
let a_Normal;
let eye = new Matrix4();
let MainCamera;
let u_UseLighting;
let u_UseTexture;
let u_Sampler;
let u_Sampler2;
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

  a_ModelMatrix0 = gl.getAttribLocation(gl.program, 'a_ModelMatrix0');
  a_ModelMatrix1 = gl.getAttribLocation(gl.program, 'a_ModelMatrix1');
  a_ModelMatrix2 = gl.getAttribLocation(gl.program, 'a_ModelMatrix2');
  a_ModelMatrix3 = gl.getAttribLocation(gl.program, 'a_ModelMatrix3');
  a_normalMatrix0 = gl.getAttribLocation(gl.program, 'a_normalMatrix0');
  a_normalMatrix1 = gl.getAttribLocation(gl.program, 'a_normalMatrix1');
  a_normalMatrix2 = gl.getAttribLocation(gl.program, 'a_normalMatrix2');
  a_normalMatrix3 = gl.getAttribLocation(gl.program, 'a_normalMatrix3');
  if (!a_ModelMatrix3) {
    console.log('Failed to get the storage location of a_ModelMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  u_UseLighting = gl.getUniformLocation(gl.program, 'u_UseLighting');
  u_UseTexture = gl.getUniformLocation(gl.program, 'u_UseTexture');
  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  u_GlobalLighting = gl.getUniformLocation(gl.program, 'u_GlobalLighting');
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  u_lightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  loadTexture(sky);
  loadTexture2(dirt);
}

function render(){
  let ViewMatrix = MainCamera.getCameraMatrix();

  gl.useProgram(gl.program);

  gl.uniformMatrix4fv(u_ViewMatrix, false, ViewMatrix.elements);
  
  gl.uniform3fv(u_lightPos, lightPos);
  let cameraPos = MainCamera.eye.elements;
  gl.uniform3fv(u_cameraPos, cameraPos);
  gl.uniform1i(u_GlobalLighting, lightOn ? 1 : 0);
  gl.uniform3fv(u_lightColor, lightColor);

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
var gorons = [];
let masterCube;

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
  let masterSphere = new Sphere();
  masterCube = new Cube();
  let world = [];

  for(let i = 0; i < 32; ++i){
    for (let j = 0; j < 32; ++j){
      if(i == 0 || i == 31 || j == 0 || j == 31){
        for (let z = 1; z <= 6; ++z){
          world.push(new instanceReference(eye, [1, 0, 0, 1], undefined,[-640+j*40, 20*z, -640+i*40], [20,20,20], undefined, true));
        }
      } else if(maze[i*32+j] == 1){
        world.push(new instanceReference(eye, [1, 0, 0, 1], undefined,[-640+j*40, 20, -640+i*40], [20,20,20], undefined, true));
      }
    }
  }

  gorons.push(new Goron(undefined, [50, 50, 0]));
  let skyCube = new instanceReference(eye, [0.5, 0.5, 0.5, 1], undefined, [0,4,0], [-2000,-2000,-2000], undefined, true);
  let sphere = new instanceReference(eye, [1,1,1,1], undefined, [-50,50, 0], [3,3,3], undefined, true);
  let lightcube = new LightReference(eye, [1,1,0,1], undefined, lightPos, [5,5,5]);

  instanceList.push(new InstanceHandler(masterCube, [lightcube], false));

  instanceList.push(new InstanceHandler(masterSphere, [sphere]));
  instanceList.push(new InstanceHandler(floor, [mainfloor]));
  instanceList.push(new InstanceHandler(new reverseCube, [skyCube], false, 1));
  instanceList.push(new InstanceHandler(masterCube, world, true, 2));
  
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