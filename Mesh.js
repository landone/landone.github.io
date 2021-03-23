import { VERTEX_SIZE } from "./objects.js";
import Transform from "./Transform.js";

export default class Mesh {

  constructor(context, obj) {
    this.gl = context;
    this.trans = new Transform();
    this.VBO = 0;
    this.EBO = 0;
    this.INDEX_COUNT = obj.indices.length;
    this.buildBuffers(obj);
  }

  draw(uniform_trans) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.EBO);

    this.gl.uniformMatrix4fv(uniform_trans, this.gl.FALSE, this.trans.getMatrix());

    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, this.gl.FALSE, VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, this.gl.FALSE, VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    this.gl.enableVertexAttribArray(1);

    this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, this.gl.FALSE, VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
    this.gl.enableVertexAttribArray(2);

    this.gl.drawElements(this.gl.TRIANGLES, this.INDEX_COUNT, this.gl.UNSIGNED_SHORT, 0);
  }

  buildBuffers(obj) {
    this.VBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(obj.verts), this.gl.STATIC_DRAW);
    
    this.EBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.EBO);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.indices), this.gl.STATIC_DRAW);
  }

}
