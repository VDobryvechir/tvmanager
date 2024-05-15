export interface Task {
    id?: string;
    name: string;
    url?: string;
    oldPresentationName?: string;
    oldPresentationId?: string;
    oldPresentationVersion?: string;
    newPresentationName?: string;
    newPresentationId?: string;
    newPresentationVersion?: string;
    connectStatus?: number;
    transferStatus?: number;
    data?: unknown;
    fileMap?: unknown;
    fileRest?: string[];
}
  