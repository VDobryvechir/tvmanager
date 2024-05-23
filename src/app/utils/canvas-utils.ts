import ScreenUtils from "./screen-utils";

export default class CanvasUtils {

  public static CanvasUtilsPoolsId = "CanvasUtilsPoolsId";
  public static FixNodePoolId = "FixNodePoolId";

  public static importantStylesForCopy = [
    "height",
    "backgroundColor",
    "padding",
  ];

    static getHiddenCanvas(): HTMLCanvasElement {
        let node = document.getElementById(CanvasUtils.CanvasUtilsPoolsId);
        if (!node) {
            node = document.createElement("div");
            node.style.width = ScreenUtils.SCREEN_RESOLUTION_WIDTH + "px";
            node.style.height = ScreenUtils.SCREEN_RESOLUTION_HEIGHT + "px";
            node.id = CanvasUtils.CanvasUtilsPoolsId;
            node.style.display = "none"; 
            document.body.appendChild(node);
        }        
        node.innerHTML = "";
        const canvasEl = document.createElement("canvas");
        canvasEl.style.width = ScreenUtils.SCREEN_RESOLUTION_WIDTH + "px";
        canvasEl.style.height = ScreenUtils.SCREEN_RESOLUTION_HEIGHT + "px";
        canvasEl.width = ScreenUtils.SCREEN_RESOLUTION_WIDTH;
        canvasEl.height = ScreenUtils.SCREEN_RESOLUTION_HEIGHT;
        node.appendChild(canvasEl);
        return canvasEl;        
    }

    static evaluateImageRelativeCoordinates(node: HTMLElement, baseNode: HTMLElement): number[] {
        const rectChild = node.getBoundingClientRect();
        const rectParent = baseNode.getBoundingClientRect();
        const info = [rectChild.left - rectParent.left, rectChild.top - rectParent.top, rectChild.right - rectChild.left, rectChild.bottom - rectChild.top];
        window.console.log("Canvas Utils subpicture is ", info);
        return info;
    }

  static async makeImage(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = reject;
      image.src = uri;
    });
  }

  static async fixImagePicture(dataUrl:string, node: HTMLElement, baseNode: HTMLElement): Promise<string> {
    const canvasEl = CanvasUtils.getHiddenCanvas();
    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
            window.console.log("Cannot get 2d context");
            return dataUrl;
    }
    const pos = CanvasUtils.evaluateImageRelativeCoordinates(node, baseNode);
    const imgMain = await CanvasUtils.makeImage(dataUrl);

    ctx.drawImage(imgMain, 0, 0, ScreenUtils.SCREEN_RESOLUTION_WIDTH, ScreenUtils.SCREEN_RESOLUTION_HEIGHT);
    ctx.drawImage(node as any, pos[0], pos[1], pos[2], pos[3]);
    try {
            const newDataUrl = canvasEl.toDataURL("image/png");
            return newDataUrl;
    } catch(err) {
            window.console.log("Cannot convert canvas to png", err);
    }
    return dataUrl;
  }

  static getPoolForImageLessNode(): HTMLElement {
    let node = document.getElementById(CanvasUtils.FixNodePoolId);
    if (!node) {
      node = document.createElement("div");
      node.id = CanvasUtils.FixNodePoolId;
      node.style.width = ScreenUtils.SCREEN_RESOLUTION_WIDTH + "px";
      node.style.height = ScreenUtils.SCREEN_RESOLUTION_HEIGHT + "px";
      node.style.left = "0px";
      node.style.top = "2000px";
      node.style.position = "absolute";
      document.body.appendChild(node);
    } else {
      node.innerHTML = "";
      node.style.display = "block";
    }
    return node;
  }

  static copyImportantStyles(src: any, dst: any): void {
    for (let name of CanvasUtils.importantStylesForCopy) {
      dst[name] = src[name];
    }
  }

  static createNodeCopyWithImportantStyles(node: HTMLElement): HTMLElement {
    const pool = CanvasUtils.getPoolForImageLessNode();
    const newNode = document.createElement("div");
    CanvasUtils.copyImportantStyles(node.style, newNode.style);
    pool.appendChild(newNode);
    return newNode;
  }

  static removeTagFromContent(content: string, pos: number): string {
    const endPos = content.indexOf(">", pos + 1);
    if (endPos < 0) {
      return content.substring(0, pos);
    }
    return content.substring(0, pos) + content.substring(endPos + 1);
  }

  static fixNodeForImageLessProcessing(node: HTMLElement): HTMLElement {
    if (!node) {
      return node;
    }
    let content = node.innerHTML;
    let pos = content.indexOf("<img ");
    if (pos < 0) {
      return node;
    }
    const newNode = CanvasUtils.createNodeCopyWithImportantStyles(node);
    const innerHTML = CanvasUtils.removeTagFromContent(content, pos);
    newNode.innerHTML = innerHTML;
    return newNode;
  }

  static releaseNodeForImageLessProcessing(): void {
    const node = document.getElementById(CanvasUtils.FixNodePoolId);
    if (!node) {
      return;
    }
    node.style.display = "none";
  }
}
