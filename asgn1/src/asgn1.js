// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};
  addActionfromUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function convertCoordinatesToWebGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x,y];
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let color = [1.0,1.0,1.0,1.0];
let g_size = 10;
let selectedType = POINT;
let circle_segments = 10;

function addActionfromUI(){
  document.getElementById("redSlide").addEventListener('mouseup', function() {color[0] = this.value/100;});
  document.getElementById("greenSlide").addEventListener('mouseup', function() {color[1] = this.value/100;});
  document.getElementById("blueSlide").addEventListener('mouseup', function() {color[2] = this.value/100;});
  document.getElementById("sizeSlide").addEventListener('mouseup', function() {g_size = this.value;});
  document.getElementById("clearButton").addEventListener('mouseup', function() {shapes_array = []; renderAllShapes();});
  document.getElementById("drawing").addEventListener('mouseup', function() {shapes_array = []; shapes_array = drawingArray.slice(); renderAllShapes();});
  document.getElementById("segmentSlide").addEventListener('mouseup', function() {circle_segments = this.value;});

  document.getElementById("point").addEventListener('mouseup', function() {selectedType = POINT;});
  document.getElementById("triangle").addEventListener('mouseup', function() {selectedType = TRIANGLE;});
  document.getElementById("circle").addEventListener('mouseup', function() {selectedType = CIRCLE;});

}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
var shapes_array = [];

function click(ev) {
 
  [x,y] = convertCoordinatesToWebGL(ev);
  var elem;
  switch(selectedType){
    case POINT:
      elem = new Point([x,y], color.slice(), g_size);
      break;
    case TRIANGLE:
      elem = new Triangle([x,y], color.slice(), g_size);
      break;
    case CIRCLE:
      elem = new Circle([x,y], color.slice(), g_size, circle_segments);
  }
  shapes_array.push(elem);

  renderAllShapes();
}

function renderAllShapes(){
  var startTime = performance.now();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (shape of shapes_array){
    shape.render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + shapes_array.length + " ms: " + Math.floor(duration) + " fps: "+ Math.floor(100000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID);
  }
  htmlElm.innerHTML = text;
}
