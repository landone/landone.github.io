import * as vec3 from "./glMatrix/vec3.js";
import * as vec4 from "./glMatrix/vec4.js";
import * as mat4 from "./glMatrix/mat4.js";
import * as Objects from "./objects.js";

var gl;
var canvas = document.getElementById('game-surface');
var uniform_trans;

var obj1 = -1;

var ReadPage = function(page, callback) {
  var xml = new XMLHttpRequest();
  xml.open("GET", page, callback != null);
  xml.send(null);
  if (callback == null) {
    return xml.responseText;
  }
  else {
    xml.onreadystatechange = function () {
      if (xml.readyState == 4 && xml.status == 200) {
        callback(xml.responseText);
      }
    };
  }
  return "";
}

class Transform {

  constructor() {
      this.pos = vec3.create();
      this.rot = vec3.create();
      this.scale = vec3.fromValues(1,1,1);
      this.posMat = mat4.create();
      this.rotMat = mat4.create();
      this.scaleMat = mat4.create();
  }

  getMatrix() {
    var matrix = mat4.create();
    mat4.translate(this.posMat, mat4.create(), this.pos);
    mat4.rotateX(this.rotMat, mat4.create(), this.rot[0]);
    mat4.rotateY(this.rotMat, mat4.create(), this.rot[1]);
    mat4.rotateZ(this.rotMat, mat4.create(), this.rot[2]);
    mat4.scale(this.scaleMat, mat4.create(), this.scale);
    mat4.mul(matrix, this.posMat, this.rotMat);
    mat4.mul(matrix, matrix, this.scaleMat);
    return matrix;
  }

}

class Mesh {

  constructor(verts) {
    this.trans = new Transform();
    this.VBO = 0;
    this.VERT_COUNT = verts.length / Objects.VERTEX_SIZE;
    this.buildVBO(verts);
  }

  draw() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

    gl.uniformMatrix4fv(uniform_trans, gl.FALSE, this.trans.getMatrix());

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

  gl.shaderSource(vertexShader, ReadPage("./vertexShader.glsl"));
  gl.shaderSource(fragShader, ReadPage("./fragmentShader.glsl"));

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

  uniform_trans = gl.getUniformLocation(program, "transMat");

  gl.useProgram(program);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  FitCanvas();

}

InitWebGL();
window.addEventListener("resize", FitCanvas);
