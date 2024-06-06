export interface WBufferBlock {
    position: WebGLBuffer | null;
    textureCoord: WebGLBuffer[];
    indices: WebGLBuffer | null;
}

export interface WAttributeBlock {
    vertexPosition: number;
    textureCoord: number[];
}

export interface WUniformBlock {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    uSampler: WebGLUniformLocation[];
}

export interface WProgramBlock {
    program: WebGLProgram;
    attribLocations: WAttributeBlock;
    uniformLocations: WUniformBlock;
}