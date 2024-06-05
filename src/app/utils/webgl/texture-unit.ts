export interface TextureUnit {
	texture: WebGLTexture;
        videoNo?: number;
        getTexture: (gl:WebGLRenderingContext) => WebGLTexture;  
        prepareTexture?: (gl:WebGLRenderingContext) => void;
        canvas?: HTMLCanvasElement;
        copyVideo: boolean;
        video: HTMLVideoElement;  
}