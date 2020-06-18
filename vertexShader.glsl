precision highp float;

attribute vec3 vertPos;
attribute vec3 vertColor;
attribute vec2 vertTex;

varying vec3 fragColor;
varying vec2 texCoords;

uniform mat4 transMat;
uniform mat4 viewMat;

void main() {

  fragColor = vertColor;
  texCoords = vertTex;
  gl_Position = viewMat * transMat * vec4(vertPos, 1.0);

}
