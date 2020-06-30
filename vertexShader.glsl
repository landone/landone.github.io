precision highp float;

attribute vec3 vertPos;
attribute vec3 vertColor;
attribute vec2 vertTex;

varying vec3 fragColor;
varying vec2 texCoords;
varying vec3 fragPos;

uniform mat4 transMat;
uniform mat4 viewMat;

void main() {

  fragColor = vertColor;
  fragPos = (transMat * vec4(vertPos, 1.0)).xyz;
  texCoords = vertTex;
  gl_Position = viewMat * vec4(fragPos, 1.0);

}
