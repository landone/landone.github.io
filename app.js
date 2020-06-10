import * as vec4 from "./glMatrix/vec4.js";
import * as mat4 from "./glMatrix/mat4.js";
import * as Objects from "./objects.js";
import * as Shaders from "./shaders.js"

var gl;
var canvas = document.getElementById('game-surface');

var obj1 = -1;

class Mesh {

  constructor(verts) {
    this.VBO = 0;
    this.VERT_COUNT = verts.length / Objects.VERTEX_SIZE;
    this.buildVBO(verts);
  }

  draw() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, Objects.VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, Objects.VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(1);

    gl.drawArrays(gl.TRIANGLES, 0, this.VERT_COUNT);
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

  if (obj1 == -1) {
    obj1 = new Mesh(Objects.SQUARE);
  }
  obj1.draw();

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

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, Shaders.vertex);
  gl.shaderSource(fragShader, Shaders.fragment);

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

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program", gl.getProgramInfoLog(program));
    return;
  }

  var posAttrib = gl.getAttribLocation(program, "vertPos");
  var colorAttrib = gl.getAttribLocation(program, "vertColor");

  gl.useProgram(program);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  FitCanvas();

}

InitWebGL();
window.addEventListener("resize", FitCanvas);
