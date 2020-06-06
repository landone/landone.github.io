var gl;
var canvas = document.getElementById('game-surface');
var vertexShader;
var fragShader;
var triVBO;

var FitCanvas = function () {

  canvas.setAttribute("style", "position:fixed;top:0px;left:0px;");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1,0,0,1);
  gl.disable(gl.SCISSOR_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(1, 1, canvas.width - 2, canvas.height - 2);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  Draw();

}

var InitDemo = function () {

  gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supoorted falling back on experimental');
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Browser does not support WebGL');
    return;
  }

  gl.clearColor(0.4, 0.6, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  fragShader = gl.createShader(gl.FRAGMENT_SHADER);

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

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program", gl.getProgramInfoLog(program));
    return;
  }

  var triVerts = [
    0.0, 0.375, 1, 0, 0,
    -0.5, -0.375, 0, 1, 0,
    0.5, -0.375, 0, 0, 1
  ];

  triVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triVerts), gl.STATIC_DRAW);

  var posAttrib = gl.getAttribLocation(program, "vertPos");
  gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(posAttrib);

  var colorAttrib = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(colorAttrib);

  gl.useProgram(program);
  gl.linkProgram(program);

  FitCanvas();

}

var Draw = function() {

  gl.bindBuffer(gl.ARRAY_BUFFER, triVBO);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}

window.addEventListener("resize", FitCanvas);
