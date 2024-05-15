import { Media } from "./media";

export interface ScreenText {
    message: string;
    color: string;
    fontSize: string;
   
}

export interface Screen {
    id: string;
    name: string;
    picture: string;
    backgroundColor: string;
    video: string;
    pictureHeight: number;
    text: ScreenText[];
    textPool: string;
    mode: string;
    file: string;
}
  
export interface ScreenSingle {
    pool: Screen;
    picture: Media[];
    video: Media[];
}