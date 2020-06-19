import WGL from "./WGL.js";
import * as Objects from "./objects.js";
import Mesh from "./Mesh.js";
import Texture from "./Texture.js";

var webgl = new WGL("game-surface");
var gl = webgl.gl;
var mainCam = webgl.cam;
var uniform_trans = webgl.UNIFORMS.TRANS;

var testTex = -1;
var obj1 = -1;
var obj2 = -1;
var obj3 = -1;

var OnDraw = function() {

    if (obj1 == -1) {
        obj1 = new Mesh(gl, Objects.TRIANGLE);
        obj1.trans.setPos(0.6, 0, 2);
        obj2 = new Mesh(gl, Objects.CUBE);
        obj2.trans.setPos(-2.5, 0, 2.5);
        obj3 = new Mesh(gl, Objects.SQUARE);
        obj3.trans.setPos(-0.6, 0, 2);
    }
    
    if(testTex == -1) {
        testTex = new Texture(gl, "./media/starry_night.jpg");
    }
    
    testTex.bind();

    obj2.trans.addRot(0, 0.05, 0);

    obj1.draw(uniform_trans);
    obj2.draw(uniform_trans);
    obj3.draw(uniform_trans);

}

webgl.onDraw = OnDraw;