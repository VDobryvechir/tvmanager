export interface TaskConfig {
    file: string[];
    duration: number[];
};

export interface Task {
    id: string;
    name: string;
    url: string;
    oldPresentationName: string;
    oldPresentationId: string;
    oldPresentationVersion: string;
    newPresentationName: string;
    newPresentationId: string;
    newPresentationVersion: string;
    connectionStatus: number;
    taskStatus: number;
    config: TaskConfig;
    realFiles: string[];
    leftFiles: string[];
};

  