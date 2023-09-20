import HavokPhysics from "@babylonjs/havok";
import { CSG, CreateBox, CreateGround, CreateSphere, Engine, FreeCamera, HavokPlugin, HemisphericLight, Material, PhysicsAggregate, PhysicsShapeType, Scene, StandardMaterial, Vector3 } from "babylonjs"
export class Game {
    scene: Scene;
    engine: Engine;
    camera: FreeCamera;
    constructor(private canvasElement: any) {
        this.init();
        this.startPhysics();
        this.startRenderCycle();
    }

    private init(): void {
        this.engine = new Engine(this.canvasElement);
        this.scene = new Scene(this.engine);
        /** @todo - need to check for ArcRotationCamera too */
        const cameraPosition: Vector3 = new Vector3(0, 5, -20);
        const lightPosition: Vector3 = new Vector3(0, 5, -10);
        this.camera = new FreeCamera("camera", cameraPosition, this.scene);
        this.camera.attachControl(this.canvasElement, false);
        const light: HemisphericLight = new HemisphericLight("light", lightPosition, this.scene);
    }

    private async startPhysics(){
        const havokInstance = await HavokPhysics();
        const hk = new HavokPlugin(true, havokInstance);
        this.scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
        const ground = CreateGround("Ground", { width: 12, height: 12, subdivisions: 2 }, this.scene);
        const sphere = CreateSphere("sphere", { diameter: 4}, this.scene);
        const innerSphere = CreateSphere("insphere", { diameter: 3.8}, this.scene);
        new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0 }, this.scene);
        const glassMaterial = new StandardMaterial("glass");
        glassMaterial.transparencyMode = 3;
        glassMaterial.alpha = 0.2;
        const csgSphere = CSG.FromMesh(sphere).subtract(CSG.FromMesh(innerSphere)).toMesh("csgSphere", glassMaterial, this.scene);
        csgSphere.position.y = 5;
        new PhysicsAggregate(csgSphere, PhysicsShapeType.MESH, { mass: 10, restitution: 0.5 }, this.scene);
        sphere.dispose();
        innerSphere.dispose();
        const smallSphere = CreateSphere("ssphere", { diameter: 0.5}, this.scene);
        smallSphere.position.y = 4;
        new PhysicsAggregate(smallSphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.5 }, this.scene);
    }

    private startRenderCycle(): void {
        this.engine.runRenderLoop(this.update.bind(this));
    }

    private update(): void {
        this.scene.render();
    }
}