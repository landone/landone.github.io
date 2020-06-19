precision mediump float;

varying vec3 fragColor;
varying vec2 texCoords;

uniform sampler2D texMap;
uniform int doColor;

void main() {

    if (doColor == 0) {
        gl_FragColor = texture2D(texMap, texCoords);
    }
    else {
        gl_FragColor = vec4(fragColor, 1.0);
    }
    
}
