import { Tvpc } from "./tvpc";

export interface Group {
    id?: string;
    name: string;
    tvpc?: string[];
}

export interface GroupPool {
    pool: Group[];
    tvpc: Tvpc[];
}

export interface GroupSingle {
    pool: Group;
    tvpc: Tvpc[];
}

