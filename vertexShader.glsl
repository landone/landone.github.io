precision highp float;

attribute vec3 vertPos;
attribute vec3 vertColor;

varying vec3 fragColor;

uniform mat4 transMat;
uniform mat4 viewMat;

void main() {

  fragColor = vertColor;
  gl_Position = viewMat * transMat * vec4(vertPos, 1.0);

}
