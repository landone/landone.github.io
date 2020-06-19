import Camera from "./Camera.js";

var self = 0;

var ReadPage = function(page, callback) {
  var xml = new XMLHttpRequest();
  xml.open("GET", page, callback != null);
  xml.send(null);
  if (callback == null) {
    return xml.responseText;
  }
  else {
    xml.onreadystatechange = function () {
      if (xml.readyState == 4 && xml.status == 200) {
        callback(xml.responseText);
      }
    };
  }
  return "";
}

export default class WGL {
    
    constructor(canvasID) {
        
        this.canvas = document.getElementById(canvasID);
        this.gl = 0;
        this.UNIFORMS = {
            TRANS: 0,
            VIEW: 0,
            TEX: 0,
            DO_COLOR: 0
        };
        this.cam = new Camera();
        this.onDraw = 0;
        
        this.initWebGL();
        
    }
    
    draw() {
        
        self.gl.clearColor(0, 0, 0, 0);
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
        self.gl.uniformMatrix4fv(self.UNIFORMS.VIEW, self.gl.FALSE, self.cam.getMatrix());
        self.gl.uniform1i(self.UNIFORMS.TEX, 0);
        self.gl.uniform1i(self.UNIFORMS.DO_COLOR, 0);
        
        if (self.onDraw != 0) {
            self.onDraw();
        }
        
    }
    
    fitCanvas() {

        self.canvas.width = window.innerWidth;
        self.canvas.height = window.innerHeight;
        self.gl.viewport(0, 0, self.canvas.width, self.canvas.height);
        self.cam.setAspect(self.canvas.width / self.canvas.height);
        self.draw();
        
    }
    
    initWebGL() {

        this.gl = this.canvas.getContext('webgl');
        this.canvas.setAttribute("style", "position:fixed;top:0px;left:0px;");

        if (!this.gl) {
            console.log('WebGL not supoorted falling back on experimental');
            this.gl = this.canvas.getContext('experimental-webgl');
        }

        if (!this.gl) {
            alert('Browser does not support WebGL');
            return;
        }

        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vertexShader, ReadPage("./vertexShader.glsl"));
        this.gl.shaderSource(fragShader, ReadPage("./fragmentShader.glsl"));

        this.gl.compileShader(vertexShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            console.error("ERROR compiling vertex shader");
            return;
        }

        this.gl.compileShader(fragShader);
        if (!this.gl.getShaderParameter(fragShader, this.gl.COMPILE_STATUS)) {
            console.error("ERROR compiling fragment shader");
            return;
        }

        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("ERROR linking program", this.gl.getProgramInfoLog(program));
            return;
        }

        var posAttrib = this.gl.getAttribLocation(program, "vertPos");
        var colorAttrib = this.gl.getAttribLocation(program, "vertColor");
        var texAttrib = this.gl.getAttribLocation(program, "vertTex");

        this.UNIFORMS.TRANS = this.gl.getUniformLocation(program, "transMat");
        this.UNIFORMS.VIEW = this.gl.getUniformLocation(program, "viewMat");
        this.UNIFORMS.TEX = this.gl.getUniformLocation(program, "texMap");
        this.UNIFORMS.DO_COLOR = this.gl.getUniformLocation(program, "doColor");

        this.gl.useProgram(program);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        
        self = this;

        window.addEventListener("resize", this.fitCanvas);
        this.fitCanvas();

        setInterval(this.draw, 20);

    }
    
}