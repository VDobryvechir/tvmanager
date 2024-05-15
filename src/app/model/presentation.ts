import { Group } from "./group";
import { Screen } from "./screen";

export interface Presentation {
    id?: string;
    name: string;
    group?: string[];
    screen?: string[];
    version?: string;
}
  
export interface PresentationSingle {
    pool: Presentation;
    group: Group[];
    screen: Screen[];
}