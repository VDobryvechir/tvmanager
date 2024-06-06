import { Group } from "./group";
import { Screen } from "./screen";

export interface Presentation {
    id?: string;
    name: string;
    group: string;
    screen: string[];
    duration: number[];
    version?: string;
    files?: string[];
    // fields to be used only in frontend
    screenIncluded?: Screen[];
    screenExcluded?: Screen[];
    groupInfo?: string;
    screenInfo?: string;
}

export interface PresentationPool {
    pool: Presentation[];
    group: Group[];
    screen: Screen[];
}

export interface PresentationSingle {
    pool: Presentation;
    group: Group[];
    screen: Screen[];
}
