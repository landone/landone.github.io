precision mediump float;

varying vec3 fragColor;
varying vec2 texCoords;

uniform sampler2D texMap;

void main() {

    gl_FragColor = texture2D(texMap, texCoords);
    
}
