export default class Texture {
    
    constructor(glContext, path) {
        
        this.gl = glContext;
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
        this.load(path);
        
    }
    
    bind() {
        
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
    }
    
    load(path) {
        
        this.bind();
        
        const glContext = this.gl;
        const tex = this.texture;
        const level = 0;
        const format = this.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 0, 255]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, format, width, height, border, srcFormat, srcType, pixel);
        
        const image = new Image();
        image.onload = function() {
            glContext.bindTexture(glContext.TEXTURE_2D, tex);
            glContext.texImage2D(glContext.TEXTURE_2D, level, format, srcFormat, srcType, image);
            if ((image.width & (image.width - 1) == 0) && (image.height & (image.height - 1) == 0)) {
                glContext.generateMipmap(glContext.TEXTURE_2D);
            }
            else {
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
            }
        };
        
        image.src = path;
        
    }
    
}