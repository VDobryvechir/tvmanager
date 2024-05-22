import { Media } from "./media";

export interface ScreenText {
    message: string;
    color: string;
    fontSize: string;
    gap: string;
}

export interface Screen {
    id?: string;
    name: string;
    picture: string;
    backgroundColor: string;
    video: string;
    pictureHeight: number;
    text: ScreenText[];
    textPool: string;
    htmlPool: string;
    mode: string;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    file: string;

    // for frontend internal use 
    videoUrl?: string;
    pictureUrl?: string;
    duration?: number;
}
  
export interface ScreenSingle {
    pool: Screen;
    picture: Media[];
    video: Media[];
}