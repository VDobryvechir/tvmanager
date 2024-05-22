export interface Tvpc {
    id?: string;
    name: string;
    url: string;
};

export type TvpcMap = {
   [key: string]: Tvpc;
};

export type StringMap = {
    [key: string]: string;
};

export type AnyMap = {
    [key: string]: any;
};

 