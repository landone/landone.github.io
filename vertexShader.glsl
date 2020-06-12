precision mediump float;

attribute vec3 vertPos;
attribute vec3 vertColor;

varying vec3 fragColor;

uniform mat4 transMat;

void main() {

  fragColor = vertColor;
  gl_Position = transMat * vec4(vertPos, 1.0);

}
