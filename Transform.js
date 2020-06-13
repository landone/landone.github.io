import * as vec3 from "./glMatrix/vec3.js";
import * as mat4 from "./glMatrix/mat4.js";

export default class Transform {

  constructor() {
      this.pos = vec3.create();
      this.rot = vec3.create();
      this.scale = vec3.fromValues(1,1,1);
      this.posMat = mat4.create();
      this.rotMat = mat4.create();
      this.scaleMat = mat4.create();
      this.matrix = mat4.create();
      this._changed = false;
  }

  setPos(x, y, z) {
    this.pos[0] = x;
    this.pos[1] = y;
    this.pos[2] = z;
    mat4.translate(this.posMat, mat4.create(), this.pos);
    this._changed = true;
  }

  addPos(x, y, z) {
    this.setPos(this.pos[0] + x, this.pos[1] + y, this.pos[2] + z);
  }

  setRot(x, y, z) {
    this.rot[0] = x;
    this.rot[1] = y;
    this.rot[2] = z;
    mat4.rotateZ(this.rotMat, mat4.create(), this.rot[2]);
    mat4.rotateY(this.rotMat, this.rotMat, this.rot[1]);
    mat4.rotateX(this.rotMat, this.rotMat, this.rot[0]);
    this._changed = true;
  }

  addRot(x, y, z) {
    this.setRot(this.rot[0] + x, this.rot[1] + y, this.rot[2] + z);
  }

  setScale(x, y, z) {
    this.scale[0] = x;
    this.scale[1] = y;
    this.scale[2] = z;
    mat4.scale(this.scaleMat, mat4.create(), this.scale);
    this._changed = true;
  }

  getMatrix() {
    if (this._changed) {
      this._changed = false;
      mat4.mul(this.matrix, this.posMat, this.rotMat);
      mat4.mul(this.matrix, this.matrix, this.scaleMat);
    }
    return this.matrix;
  }

}
