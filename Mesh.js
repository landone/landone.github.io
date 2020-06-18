import { VERTEX_SIZE } from "./objects.js";
import Transform from "./Transform.js";

export default class Mesh {

  constructor(context, verts) {
    this.gl = context;
    this.trans = new Transform();
    this.VBO = 0;
    this.VERT_COUNT = verts.length / VERTEX_SIZE;
    this.buildVBO(verts);
  }

  draw(uniform_trans) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);

    this.gl.uniformMatrix4fv(uniform_trans, this.gl.FALSE, this.trans.getMatrix());

    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, this.gl.FALSE, VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, this.gl.FALSE, VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      this.gl.enableVertexAttribArray(1);
      
      this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, this.gl.FALSE, VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
      this.gl.enableVertexAttribArray(2);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.VERT_COUNT);
  }

  buildVBO(vertexArray) {
    this.VBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexArray), this.gl.STATIC_DRAW);
  }

}
