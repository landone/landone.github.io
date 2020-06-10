export var vertex =
'precision mediump float;\
attribute vec2 vertPos;\
attribute vec3 vertColor;\
varying vec3 fragColor;\
\
void main() {\
  fragColor = vertColor;\
  gl_Position = vec4(vertPos, 0.0, 1.0);\
}';



export var fragment =
'precision mediump float;\
varying vec3 fragColor;\
\
void main() {\
  gl_FragColor = vec4(fragColor, 1.0);\
}';
