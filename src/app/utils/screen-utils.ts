import { Screen, ScreenText } from "../model/screen";
import { Media } from "../model/media";
import SvgConverter from "./svg-converter";
import CanvasUtils from "./canvas-utils";

export default class ScreenUtils {

    public static SCREEN_MODE_TEXT = "text";
    public static SCREEN_MODE_HTML = "html";
    public static SCREEN_MODE_PICTURE = "picture";
    public static SCREEN_MODE_VIDEO = "video";
    public static SCREEN_MODE_TABLE = [
        ScreenUtils.SCREEN_MODE_TEXT, 
        ScreenUtils.SCREEN_MODE_HTML,
        ScreenUtils.SCREEN_MODE_PICTURE,
        ScreenUtils.SCREEN_MODE_VIDEO,
    ];
    public static SCREEN_RESOLUTION_HEIGHT = 900;
    public static SCREEN_RESOLUTION_WIDTH = 1600;

    public static singleImageId = "ScreenUtilsSingleImageId";

    static root = "";

    static setRoot(root:string): void {
        ScreenUtils.root = root;
    }

    static getModeIndex(name: string): number {
        const n = ScreenUtils.SCREEN_MODE_TABLE.findIndex(item=> item===name);
        return n>0 ? n : 0;
    }

    static generatePictureHtml(screen: Screen): string {
        if (!screen.pictureUrl) {
            return "";
        }
        return `<img src='${ScreenUtils.root}${screen.pictureUrl}' height='100%' id='${ScreenUtils.singleImageId}' />`;
    } 

    static generateTextModeTextPart(part: ScreenText): string {
        if (!part || !part.message) {
            return "";
        }
        const pre = `<div style='color:${part.color};font-size:${part.fontSize}px;text-align:center;padding-top:${part.gap}px;line-height:1'>`;
        const post = `</div>`;
        return pre + part.message + post;
    }

    static generateTextModeText(screen: Screen): string {
        const n = screen.text?.length;
        if (!n) {
            return "";
        }
        let res = "";
        for(let i=0;i<n;i++) {
            res += ScreenUtils.generateTextModeTextPart(screen.text[i]);
        }
        if (!screen.picture || !screen.pictureUrl) {
            return res;
        }
        let p = 100 - screen.pictureHeight;
        if (p<=0) {
            p = 1;
        }
        const pre = `<div style='height:${p}%;overflow:hidden;text-align:center'>`;
        const post = `</div>`;
        return pre + res + post;
    }

    static generatePictureAsPartOfText(screen: Screen): string {
        const picture = ScreenUtils.generatePictureHtml(screen);
        if (!screen.text || !screen.text.length || !picture) {
            return picture;
        }
        const pre = `<div style='height:${screen.pictureHeight}%;overflow:hidden;text-align:center'>`;
        const post = `</div>`;
        return pre + picture + post;
    }

    static recalculateTextPool(screen: Screen): void {
        switch (screen.mode) {
            case this.SCREEN_MODE_PICTURE:
                screen.textPool = ScreenUtils.generatePictureHtml(screen);
                break;
            case this.SCREEN_MODE_TEXT:
                screen.textPool = ScreenUtils.generateTextModeText(screen) + "\n "+ ScreenUtils.generatePictureAsPartOfText(screen);
                break;
        }
    }

    static recalculateHtmlPool(screen: Screen): void {
        if (screen.mode === this.SCREEN_MODE_VIDEO) {
            screen.htmlPool=`<video width='100%' height='100%' controls><source src='${ScreenUtils.root}${screen.videoUrl}' /></video>`;
            return;
        }
        const pre = `<div style='box-sizing: border-box;height:${this.SCREEN_RESOLUTION_HEIGHT}px;background-color:${screen.backgroundColor};padding:${screen.paddingTop}px ${screen.paddingRight}px ${screen.paddingBottom}px ${screen.paddingLeft}px'>`;
        const post = `</div>`;
        screen.htmlPool = pre + screen.textPool + post;
    }

    static recalculateHtml(screen: Screen): void {
        ScreenUtils.recalculateTextPool(screen);
        ScreenUtils.recalculateHtmlPool(screen);
    }

    static recalculateFile(screen: Screen): Promise<void> {
        if (screen.mode === this.SCREEN_MODE_VIDEO) {
            screen.file=screen.videoUrl || "";
            return Promise.resolve();
        }
        const name = "preview1600";
        let node = document.getElementById(name);
        if (!node) {
            node = document.createElement("div");
            node.id = name;
            node.style.position = "absolute";
            node.style.left = "0";
            node.style.top = "1000px";
            node.style.width = `${this.SCREEN_RESOLUTION_WIDTH}px`;
            node.style.height = `${this.SCREEN_RESOLUTION_HEIGHT}px`;
            document.body.appendChild(node);
        }
        node.innerHTML = screen.htmlPool;
        node.style.display = "block";
        let subNode = CanvasUtils.fixNodeForImageLessProcessing(node.children[0] as HTMLElement);
        const res = SvgConverter.toPng(subNode, (dataUrl: string) => {
          screen.file = dataUrl;
          const imgNode = document.getElementById(ScreenUtils.singleImageId);
          if (imgNode) {
            CanvasUtils.fixImagePicture(dataUrl, imgNode, node!).then((data: string) => {
              screen.file = data;
              CanvasUtils.releaseNodeForImageLessProcessing();
            });
          } else {
            CanvasUtils.releaseNodeForImageLessProcessing(); 
          } 
            node!.style.display = "none";
        });
        return res as Promise<void>;
     }

    static adjustVideoUrl(screen: Screen, video: Media[]): void {
        if (screen.video) {
            const item = video.find(item => item.id === screen.video);
            if (!item) {
                screen.video = "";
            } else {
                screen.videoUrl=item.file;
                if (screen.mode===this.SCREEN_MODE_VIDEO) {
                  screen.file = screen.videoUrl || "";
                  screen.fileName = item.fileName; 
                }
            }
        }
    }

    static adjustPictureUrl(screen: Screen, picture: Media[]): void {
        if (screen.picture) {
            const item = picture.find(item => item.id === screen.picture);
            if (!item) {
                screen.picture = "";
            } else {
                screen.pictureUrl=item.file;
                if (screen.mode===this.SCREEN_MODE_PICTURE) {
                    screen.file = screen.pictureUrl || "";
                }
            }
        }
    }

    static adjustAllParameters(screen: Screen, video: Media[], picture: Media[]): void {
        ScreenUtils.adjustVideoUrl(screen, video);
        ScreenUtils.adjustPictureUrl(screen, picture);
        ScreenUtils.recalculateHtml(screen);
    }

}
