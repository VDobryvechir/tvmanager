import { TextureUnit } from "./texture-unit"

export default class WTextureUtils {

   static loadTextures(gl:WebGLRenderingContext, urls:string[], durations: number[]): TextureUnit[] {
  	const textures: TextureUnit[] = [];
  	const n = urls.length;
        let videoCount = 0;
  	for(let i=0;i<n;i++) {
      		textures[i] = WTextureUtils.loadTexture(gl, urls[i], durations[i] || 0, videoCount);
                if (textures[i].videoNo!==undefined) {
                    videoCount++;
                }
  	}
  	return textures;
   }
//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
  static loadTexture(gl:WebGLRenderingContext, url:string, duration: number, videoCount: number): TextureUnit {
  	const texture = gl.createTexture();
	if (!texture) {
		console.log("no texture");
		throw new Error("No texture");
	}
  	gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  	const level = 0;
  	const internalFormat = gl.RGBA;
  	const width = 1;
  	const height = 1;
  	const border = 0;
  	const srcFormat = gl.RGBA;
  	const srcType = gl.UNSIGNED_BYTE;
  	const pixel = new Uint8Array([0, 0, 0, 0]); // opaque blue
  	gl.texImage2D(
    		gl.TEXTURE_2D,
    		level,
    		internalFormat,
    		width,
    		height,
    		border,
    		srcFormat,
    		srcType,
    		pixel
  	);
  	const isVideo = (url: string) => {
     		const pos = url.lastIndexOf(".");
     		if (pos<=0) {
         		return false;
     		}
     		const ext = url.substring(pos+1).toLowerCase();
     		return ext==="mp4" || ext==="webm" || ext==="ogg";
  	};
  	const isPowerOf2 = (value: number)=>{
     		return (value & (value - 1)) === 0;
  	};
  	if (isVideo(url)) {
  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        return WTextureUtils.getVideoTexture(url, texture, videoCount);
  	}
  	const durationInfo = (nmb: number): string => {
     		if (!(nmb>0)) {
         		return "00:00";
     		}
     		const sec = nmb % 60;
     		const minutes = Math.round((nmb-sec)/60);
     		return (minutes<10 ? "0" : "") + minutes + ":" + (sec<10? "0" : "")+sec;
  	};
  	const dstImage = new Image();
  	const remakeImage = (img: HTMLImageElement, fn:()=>void) => {
      		const cnv = document.createElement("canvas");
      		const headerHeight = img.width > 300 && img.height>100 ? 70: 0;
      		cnv.width = img.width + 2;
      		cnv.height = img.height + 2 + headerHeight;
      		const ctx = cnv.getContext("2d");
			if (!ctx) {
				return;
			}
      		ctx.fillStyle = "#000000";
      		ctx.fillRect(0, 0, cnv.width, cnv.height);
      		ctx.drawImage(img, 1, 1 + headerHeight);
      		if (headerHeight>0) {
         		ctx.fillStyle = "#00bfff";
         		ctx.fillRect(1, 1, cnv.width-2, headerHeight);
         		ctx.font = "64px serif";
		        ctx.fillStyle = "#ffffff";
         		let textX =  cnv.width / 2 - 50;
         		ctx.fillText(durationInfo(duration), textX, 60);
      		}
      		const base64URI = cnv.toDataURL();
      		dstImage.onload = fn; 
      		dstImage.src = base64URI;
  	}; 
  	const image = new Image();
  	image.onload = () => {
    		image.onload = null;
    		remakeImage(image,()=>{
      			dstImage.onload = null;
    			gl.bindTexture(gl.TEXTURE_2D, texture);
    			gl.texImage2D(
      				gl.TEXTURE_2D,
      				level,
		      		internalFormat,
      				srcFormat,
      				srcType,
      				dstImage
    			);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    			if (isPowerOf2(dstImage.width) && isPowerOf2(dstImage.height)) {
      // Yes, it's a power of 2. Generate mips.
      				gl.generateMipmap(gl.TEXTURE_2D);
    			} else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    			}
    		});
  	};
  	image.src = url;
  	const imageBlock = {
      		texture: texture,
      		getTexture: () => {
           		return imageBlock.texture;   
      		},
  	};
  	return imageBlock;
  }

  static preupdateVideo(videoBlock: TextureUnit): void {
        let canva = videoBlock.canvas;
        if (!canva) {
           canva = document.createElement("canvas");
           // TODO may be use videoBlock.video.videoHeight, videoBlock.video.videoWidth to optimize view
           canva.width = 320;
           canva.height =  240;
           videoBlock.canvas = canva;
        }
        const ctx = canva.getContext("2d");
		if (!ctx) {
			console.log("No context");
			return;
		}
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canva.width, canva.height);  
		if (videoBlock.video) {
         	ctx.drawImage(videoBlock.video, 1, 1,318,238);
		}
        const base64URI = canva.toDataURL();
        const dstImage = new Image();    
        dstImage.onload = ()=>{
            videoBlock.image = dstImage; 
            dstImage.onload = null; 
        }; 
        dstImage.src = base64URI;
  }

  static getVideoTexture(url: string, texture: WebGLTexture, videoCount: number): TextureUnit {
  	const updateTexture = (gl: WebGLRenderingContext, texture: WebGLTexture, img: HTMLImageElement, nr: number) => {
		const level = 0;
  		const internalFormat = gl.RGBA;
  		const srcFormat = gl.RGBA;
  		const srcType = gl.UNSIGNED_BYTE;
        	gl.activeTexture(gl.TEXTURE4 + (nr % 4));
  		gl.bindTexture(gl.TEXTURE_2D, texture);
  		gl.texImage2D(
    			gl.TEXTURE_2D,
    			level,
    			internalFormat,
    			srcFormat,
    			srcType,
    			img
  		);
  	}
  	const video = document.createElement("video");
  	const videoBlock: TextureUnit = {
     		texture: texture,
     		video: video,
     		copyVideo: false,
     		videoNo: videoCount,
     		getTexture: () => {
         		return videoBlock.texture;
     		},
     		prepareTexture: (gl: WebGLRenderingContext) => {
      			if (videoBlock.copyVideo) {
                		WTextureUtils.preupdateVideo(videoBlock);
                		if (videoBlock.image && videoBlock.videoNo!==undefined) {
      		    			updateTexture(gl, videoBlock.texture, videoBlock.image, videoBlock.videoNo);
                		}
    			}
     		},
  	}; 

  	let playing = false;
  	let timeupdate = false;

  	video.playsInline = true;
  	video.muted = true;
  	video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  	const checkReady = ()=>{
    		if (playing && timeupdate) {
      			videoBlock.copyVideo = true;
    		}
  	};

  	const playingListener = () => {
      		playing = true;
      		checkReady();
      		video.removeEventListener("playing", playingListener, true);	
  	};

  	video.addEventListener("playing", playingListener, true);

  	const timeUpdateListener = () => {
      		timeupdate = true;
      		checkReady();
      		video.removeEventListener("timeupdate", timeUpdateListener, true);	
  	};
  	video.addEventListener("timeupdate", timeUpdateListener, true);

  	video.src = url;
  	video.play();

  	return videoBlock;
  }

}
