import * as Objects from "./objects.js";
import Transform from "./Transform.js";
import Camera from "./Camera.js";
import Mesh from "./Mesh.js";

var gl;
var canvas = document.getElementById('game-surface');
var uniform_trans;
var uniform_view;

var mainCam = new Camera();

var obj1 = -1;
var obj2 = -1;
var obj3 = -1;

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

var FitCanvas = function () {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  mainCam.setAspect(canvas.width / canvas.height);
  //Draw();

}

var Draw = function() {

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(uniform_view, gl.FALSE, mainCam.getMatrix());

  if (obj1 == -1) {
    obj1 = new Mesh(gl, Objects.TRIANGLE);
    obj1.trans.setPos(0.6, 0, 2);
    obj2 = new Mesh(gl, Objects.CUBE);
    obj2.trans.setPos(-2.5, 0, 2.5);
    obj3 = new Mesh(gl, Objects.SQUARE);
    obj3.trans.setPos(-0.6, 0, 2);
  }

  obj1.trans.addRot(0, 0, Math.PI / 64.0);
  obj2.trans.addRot(0, Math.PI / 64.0, 0);

  obj1.draw(uniform_trans);
  obj2.draw(uniform_trans);
  obj3.draw(uniform_trans);

}

var InitWebGL = function () {

  gl = canvas.getContext('webgl');
  canvas.setAttribute("style", "position:fixed;top:0px;left:0px;");

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
  uniform_view = gl.getUniformLocation(program, "viewMat");

  gl.useProgram(program);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  window.addEventListener("resize", FitCanvas);
  FitCanvas();

  setInterval(Draw, 20);

}

InitWebGL();
