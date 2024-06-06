export interface TextureUnit {
	texture: WebGLTexture;
        videoNo?: number;
        getTexture: () => WebGLTexture;  
        prepareTexture?: (gl:WebGLRenderingContext) => void;
        canvas?: HTMLCanvasElement;
        copyVideo?: boolean;
        video?: HTMLVideoElement;
        image?: HTMLImageElement;  
}