import ScreenUtils from "./screen-utils";

export default class CanvasUtils {

    public static CanvasUtilsPoolsId = "CanvasUtilsPoolsId";

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

    static fixImagePicture(dataUrl:string, node: HTMLElement, baseNode: HTMLElement): string {
        const canvasEl = CanvasUtils.getHiddenCanvas();
        const ctx = canvasEl.getContext("2d");
        if (!ctx) {
            window.console.log("Cannot get 2d context");
            return dataUrl;
        }
        const imgMain = new Image();
        imgMain.src = dataUrl;
        ctx.drawImage(imgMain, 0, 0, ScreenUtils.SCREEN_RESOLUTION_WIDTH, ScreenUtils.SCREEN_RESOLUTION_HEIGHT);
        const pos = CanvasUtils.evaluateImageRelativeCoordinates(node, baseNode);
        ctx.drawImage(node as any, pos[0], pos[1], pos[2], pos[3]);
        try {
            const newDataUrl = canvasEl.toDataURL("image/png");
            return newDataUrl;
        } catch(err) {
            window.console.log("Cannot convert canvas to png", err);
        }
        return dataUrl;
    }

}