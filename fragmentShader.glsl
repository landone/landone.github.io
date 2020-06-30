precision mediump float;

varying vec3 fragColor;
varying vec3 fragPos;
varying vec2 texCoords;

uniform sampler2D texMap;
uniform int doColor;
uniform vec4 aimDir;

void main() {

    if (doColor == 0) {
        gl_FragColor = texture2D(texMap, texCoords);
    }
    else {
        gl_FragColor = vec4(fragColor, 1.0);
    }
    
    gl_FragColor *= (1.0 - clamp(distance(aimDir.xyz, fragPos) / 2.0, 0.0, 1.0));
    gl_FragColor.w = 1.0;
    
}
