import WGL from "./WGL.js";
import * as Objects from "./objects.js";
import Mesh from "./Mesh.js";
import Texture from "./Texture.js";

import * as vec4 from "./glMatrix/vec4.js";
import * as mat4 from "./glMatrix/mat4.js";

var webgl = new WGL("game-surface");
var gl = webgl.gl;
var mainCam = webgl.cam;
var uniform_trans = webgl.UNIFORMS.TRANS;

var wallTex = -1;
var floorTex = -1;
var obj1 = -1;
var obj2 = -1;
var obj3 = -1;
var floor = -1;
var ceil = -1;

var mousePos = vec4.fromValues(0, 0, 0, 1);
var uniform_aim = gl.getUniformLocation(webgl.program, "aimDir");

var OnDraw = function() {
    
    var dir = vec4.create();
    var inverse = mat4.create();
    mat4.invert(inverse, mainCam.getMatrix());
    vec4.transformMat4(dir, mousePos, inverse);
    gl.uniform4fv(uniform_aim, dir);

    if (obj1 == -1) {
        obj1 = new Mesh(gl, Objects.SQUARE);
        obj1.trans.setPos(0.5, -0.5, 1);
        obj1.trans.setRot(0, Math.PI / 2.0, 0);
        obj2 = new Mesh(gl, Objects.SQUARE);
        obj2.trans.setPos(-0.5, -0.5, 0);
        obj2.trans.setRot(0, -Math.PI / 2.0, 0);
        obj3 = new Mesh(gl, Objects.SQUARE);
        obj3.trans.setPos(-0.5, -0.5, 1);
        
        floor = new Mesh(gl, Objects.SQUARE);
        floor.trans.setPos(-0.5, -0.5, 0);
        floor.trans.setRot(Math.PI / 2.0, 0, 0);
        
        ceil = new Mesh(gl, Objects.SQUARE);
        ceil.trans.setPos(-0.5, 0.5, 1);
        ceil.trans.setRot(-Math.PI / 2.0, 0, 0);
    }
    
    if(wallTex == -1) {
        wallTex = new Texture(gl, "./media/webgl/bricks.png");
        floorTex = new Texture(gl, "./media/webgl/stone.png");
    }
    
    wallTex.bind();

    obj1.draw(uniform_trans);
    obj2.draw(uniform_trans);
    obj3.draw(uniform_trans);
    
    floorTex.bind();
    
    floor.draw(uniform_trans);
    ceil.draw(uniform_trans);

}

var OnMouseMove = function(event) {
    
    event = event || window.event;
    
    mousePos[0] = event.pageX * 2.0 / webgl.canvas.width - 1.0;
    mousePos[1] = 1.0 - event.pageY * 2.0 / webgl.canvas.height;
    
}

document.onmousemove = OnMouseMove;
webgl.onDraw = OnDraw;