import * as vec3 from "./glMatrix/vec3.js";
import * as vec4 from "./glMatrix/vec4.js";
import * as mat4 from "./glMatrix/mat4.js";

import Transform from "./Transform.js";

export default class Camera {

  constructor() {
    this.trans = new Transform();
    this.forward = vec3.fromValues(0, 0, 1);
    this.up = vec3.fromValues(0, 1, 0);
    this.aspect = 16.0 / 9.0;
    this.fov = Math.PI * 70 / 180;
    this.near = 0.01;
    this.far = 10000;
    this.perspective = mat4.create();
    this.viewMat = mat4.create();
    this.lookMat = mat4.create();
    this._changed = true;
    this.trans._changed = true;
  }

  setForward(x, y, z) {
    this.forward[0] = x;
    this.forward[1] = y;
    this.forward[2] = z;
    this._changed = true;
  }

  setUp(x, y, z) {
    this.up[0] = x;
    this.up[1] = y;
    this.up[2] = z;
    this._changed = true;
  }

  setAspect(val) {
    this.aspect = val;
    this._changed = true;
  }

  setFOV(val) {
    this.fov = val;
    this._changed = true;
  }

  setBounds(near, far) {
    this.near = near;
    this.far = far;
    this._changed = true;
  }

  getMatrix() {

    if (this._changed || this.trans._changed) {

      if (this._changed) {
        this._changed = false;
        mat4.perspective(this.perspective, this.fov, this.aspect, this.near, this.far);
      }

      if (this.trans._changed) {
        var transMat = this.trans.getMatrix();
        var origin = vec4.create();
        var center = vec4.create();

        vec4.transformMat4(origin, vec4.fromValues(0,0,0,1), transMat);
        origin = vec3.fromValues(origin[0], origin[1], origin[2]);
        vec4.transformMat4(center, vec4.fromValues(this.forward[0], this.forward[1], this.forward[2], 1), transMat);
        center = vec3.fromValues(center[0], center[1], center[2]);

        mat4.lookAt(this.lookMat, origin, center, this.up);
      }

      mat4.mul(this.viewMat, this.perspective, this.lookMat);

    }

    return this.viewMat;

  }

}
