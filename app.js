import * as vec4 from "./glMatrix/vec4.js";
import * as mat4 from "./glMatrix/mat4.js";

var memat = mat4.create();
console.log(memat);

var gl;
var canvas = document.getElementById('game-surface');
var posAttrib;
var colorAttrib;
var program;

var tri1;
var tri2;
var triVerts = [
  0.5, 0.375, 1, 0, 0,
  0.0, -0.375, 0, 1, 0,
  1.0, -0.375, 0, 0, 1
];

var tri2Verts = [
  -0.5, 0.375, 1, 0, 0,
  -1.0, -0.375, 0, 0, 1,
  0.0, -0.375, 0, 1, 0
];

class Mesh {

  constructor(verts) {
    this.VBO = 0;
    this.buildVBO(verts);
  }

  draw() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(posAttrib);

    gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorAttrib);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  buildVBO(vertexArray) {
    this.VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
  }

}

var FitCanvas = function () {

  canvas.setAttribute("style", "position:fixed;top:0px;left:0px;");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height)
  Draw();

}

var Draw = function() {

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  tri1.draw();
  tri2.draw();

}

var InitWebGL = function () {

  gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supoorted falling back on experimental');
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Browser does not support WebGL');
    return;
  }

  var vertexShaderSrc = [
  "precision mediump float;",
  "attribute vec2 vertPos;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",

  "void main() {",
    "fragColor = vertColor;",
    "gl_Position = vec4(vertPos, 0.0, 1.0);",
  "}"
  ].join('\n');

  var fragShaderSrc = [
  "precision mediump float;",
  "varying vec3 fragColor;",

  "void main() {",
    "gl_FragColor = vec4(fragColor, 1.0);",
  "}",
  ].join('\n');

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderSrc);
  gl.shaderSource(fragShader, fragShaderSrc);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("ERROR compiling vertex shader");
    return;
  }

  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    console.error("ERROR compiling fragment shader");
    return;
  }

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program", gl.getProgramInfoLog(program));
    return;
  }

  posAttrib = gl.getAttribLocation(program, "vertPos");
  colorAttrib = gl.getAttribLocation(program, "vertColor");

  gl.useProgram(program);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  tri1 = new Mesh(triVerts);
  tri2 = new Mesh(tri2Verts);

  FitCanvas();

}

window.addEventListener("resize", FitCanvas);
InitWebGL();
