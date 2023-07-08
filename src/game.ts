import { CreateBox, CreateGround, Engine, FreeCamera, HemisphericLight, Scene, Vector3 } from "babylonjs"
export class Game {
    scene: Scene;
    engine: Engine;
    camera: FreeCamera;
    constructor(private canvasElement: any) {
        this.init();
        this.startRenderCycle();
    }

    private init(): void {
        this.engine = new Engine(this.canvasElement);
        this.scene = new Scene(this.engine);
        /** @todo - need to check for ArcRotationCamera too */
        const cameraPosition: Vector3 = new Vector3(0, 5, -10);
        const lightPosition: Vector3 = new Vector3(0, 5, -10);
        this.camera = new FreeCamera("camera", cameraPosition, this.scene);
        this.camera.attachControl(this.canvasElement, false);
        const light: HemisphericLight = new HemisphericLight("light", lightPosition, this.scene);
        const ground = CreateGround("Ground", { width: 12, height: 12, subdivisions: 2 }, this.scene);
        const box = CreateBox("box", { size: 3.0 }, this.scene);
    }

    private startRenderCycle(): void {
        this.engine.runRenderLoop(this.update.bind(this));
    }

    private update(): void {
        this.scene.render();
    }
}