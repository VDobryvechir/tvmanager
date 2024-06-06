import { WTaskUnit } from "./webgl/wtask-unit";
import { presentPictureVideosAndDuration, stopPictureVideo } from "./webgl/cube";

export class WebglUtils {

    static presentPictureVideosWithDuration(files:string[], durations:number[], elem: HTMLCanvasElement): WTaskUnit {
        const task = presentPictureVideosAndDuration(files, durations, elem);
        return task;
    } 

    static finishPictureVideo(task: WTaskUnit): void {
        stopPictureVideo(task);
    }
};
