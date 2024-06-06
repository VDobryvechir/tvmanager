export class WTaskUnit {
    cubeRotation = 0.0;
    deltaTime = 0;
    logicTexture: number[] = [];
    logicBasis = 0;
    drawFinished: Promise<any> | null = null;
    drawResolve?: (value: any) => void ;
    releaseBuf: any[] = [];
}