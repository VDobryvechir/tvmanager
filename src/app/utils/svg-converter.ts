import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

export default class SvgConverter {

    static method1 = "domtohtml";
    static method2 = "htmltoimage";
 
    static method = SvgConverter.method1;

    static toPng(node: HTMLElement, fn: (dataUrl: string)=> void): Promise<void> {
        if (SvgConverter.method === SvgConverter.method1) {
            return SvgConverter.toPngMethod1(node, fn);
        }
        return SvgConverter.toPngMethod2(node, fn);
    }

    static toPngMethod1(node: HTMLElement, fn: (dataUrl: string)=> void): Promise<void> {
        return (window as any).domtoimage.toPng(node).then(fn);
    }

    static toPngMethod2(node: HTMLElement, fn: (dataUrl: string)=> void): Promise<void> {
        return htmlToImage.toPng(node).then(fn);
    }


}