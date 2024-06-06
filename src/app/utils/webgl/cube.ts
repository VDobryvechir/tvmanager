import WTextureUtils from "./texture";
import { TextureUnit } from "./texture-unit";
import { WTaskUnit } from "./wtask-unit";
import { initBuffers } from "./buffers";
import { WBufferBlock, WProgramBlock } from "./buffer-block";

function drawScene(gl: WebGLRenderingContext, programInfo: WProgramBlock, buffers: WBufferBlock, textures: TextureUnit[], task: WTaskUnit) {
  const mat4: any = (window as any)["mat4"] || {};

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (23 * Math.PI) / 180; // in radians
  const aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate
/*************
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around (Z)
***************/
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    task.cubeRotation * Math.PI * 0.1, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (Y)
/***************************
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.3, // amount to rotate in radians
    [1, 0, 0]
  ); // axis to rotate around (X)
****************************/
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  setTextureAttribute(gl, buffers, programInfo);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  for(let i=0;i<4;i++) {
  	// Tell WebGL we want to affect texture unit 0
  	gl.activeTexture(gl.TEXTURE0 + i);

  	// Bind the texture to texture unit 0
  	gl.bindTexture(gl.TEXTURE_2D, textures[task.logicTexture[i]].getTexture());

  	// Tell the shader we bound the texture to texture unit 0
  	gl.uniform1i(programInfo.uniformLocations.uSampler[i], i);
  }
  const cubPart = (Math.floor(task.cubeRotation / 5)+2) % 4;

  if (task.logicBasis==3 || task.logicBasis>4) {
     task.logicTexture[cubPart]=(task.logicTexture[(cubPart+3)%4]+1)  % task.logicBasis;
  }
  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
  for(let i=0;i<textures.length;i++) {
        const fn = textures[i]; 
        if (fn.prepareTexture) {
            fn.prepareTexture(gl);
        }
  }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl: WebGLRenderingContext, buffers: WBufferBlock, programInfo: WProgramBlock) {
  const numComponents = 3;
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}
/*********** 
// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl: WebGLRenderingContext, buffers: WBufferBlock, programInfo: WProgramBlock) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}
****/

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl: WebGLRenderingContext, buffers: WBufferBlock, programInfo: WProgramBlock) {
 
  for(let i=0;i<4;i++) {
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord[i]);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord[i],
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord[i]);
 }
}


export async function stopPictureVideo(task: WTaskUnit): Promise<any> {
    if (task.logicTexture.length===0) {
       return Promise.resolve();
    }
    if (task.drawFinished) {
       return task.drawFinished;
    }
    task.drawFinished=new Promise((resolve,reject)=>{
       task.drawResolve = resolve;
    });
    return task.drawFinished; 
}


export function presentPictureVideosAndDuration(files: string[], durations: number[], canvas: HTMLCanvasElement): WTaskUnit {
  const task: WTaskUnit = new WTaskUnit;
  task.logicBasis = files.length;
  // Initialize the GL context
  const gl = canvas.getContext("webgl");
  // Only continue if WebGL is available and working
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return task;
  }
  for(let i=0;i<4;i++) {
      task.logicTexture[i] = i % task.logicBasis;
  }
  if (task.logicBasis===3) {
      task.logicTexture[3]=2;
  }
  // Set clear color to black, fully transparent
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord0;
  attribute vec2 aTextureCoord1;  
  attribute vec2 aTextureCoord2;
  attribute vec2 aTextureCoord3;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord0;
  varying highp vec2 vTextureCoord1;
  varying highp vec2 vTextureCoord2;
  varying highp vec2 vTextureCoord3;
  
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord0 = aTextureCoord0;
    vTextureCoord1 = aTextureCoord1;
    vTextureCoord2 = aTextureCoord2;
    vTextureCoord3 = aTextureCoord3;
  }
`;

  // Fragment shader program

  const fsSource = `
  varying highp vec2 vTextureCoord0;
  varying highp vec2 vTextureCoord1;
  varying highp vec2 vTextureCoord2;
  varying highp vec2 vTextureCoord3;

  uniform sampler2D uSampler0;
  uniform sampler2D uSampler1;
  uniform sampler2D uSampler2;
  uniform sampler2D uSampler3;

  void main(void) {
    highp vec4 color0 = texture2D(uSampler0, vTextureCoord0);
    highp vec4 color1 = texture2D(uSampler1, vTextureCoord1);
    highp vec4 color2 = texture2D(uSampler2, vTextureCoord2);
    highp vec4 color3 = texture2D(uSampler3, vTextureCoord3);
    gl_FragColor =  color0 + color1 + color2 + color3;
  }
`;

   //  + color1 + color2 + color3
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource, task.releaseBuf);
  if (!shaderProgram) {
    return task;
  }
  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo: WProgramBlock = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      textureCoord: [gl.getAttribLocation(shaderProgram, "aTextureCoord0"),gl.getAttribLocation(shaderProgram, "aTextureCoord1"),gl.getAttribLocation(shaderProgram, "aTextureCoord2"), gl.getAttribLocation(shaderProgram, "aTextureCoord3")],
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ) as WebGLUniformLocation,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix") as WebGLUniformLocation,
      uSampler: [gl.getUniformLocation(shaderProgram, "uSampler0"),gl.getUniformLocation(shaderProgram, "uSampler1"),gl.getUniformLocation(shaderProgram, "uSampler2"),gl.getUniformLocation(shaderProgram, "uSampler3")] as WebGLUniformLocation[],
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Load textures
  const textures = WTextureUtils.loadTextures(gl, files, durations);
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let then = 0;
  function releaseBuffers() {
     task.logicTexture.length = 0;
     let n = textures.length;
     for(let i=0;i<n;i++) {
         gl!.deleteTexture(textures[i].texture);
     }
     textures.length=0;
     n = task.releaseBuf.length;
     for(let i=0;i<n;i++) {
         task.releaseBuf[i]();
     }
     task.releaseBuf.length=0;
  }
  // Draw the scene repeatedly
  function render(now: number) {
    now *= 0.002; // convert to seconds
    task.deltaTime = now - then;
    then = now;
    drawScene(gl!, programInfo, buffers, textures, task);
    task.cubeRotation += task.deltaTime;
    if (task.drawResolve) {
       releaseBuffers();
       task.drawResolve(null);
       task.drawResolve = undefined; 
    } else {
       requestAnimationFrame(render);
    }
  }
  requestAnimationFrame(render);
  return task;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string, releaseBuf: any[]) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  if (!shaderProgram || !vertexShader || !fragmentShader) {
    return null;
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  releaseBuf.push(gl.deleteProgram.bind(gl, shaderProgram));
  releaseBuf.push(gl.deleteShader.bind(gl, fragmentShader));
  releaseBuf.push(gl.deleteShader.bind(gl, vertexShader));
  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}



