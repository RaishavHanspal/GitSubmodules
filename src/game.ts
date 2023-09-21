import HavokPhysics from "@babylonjs/havok";
import { AbstractMesh, ArcRotateCamera, CSG, CreateGround, CreateSphere, Engine, FreeCamera, HavokPlugin, HemisphericLight, PhysicsAggregate, PhysicsShapeType, Scene, SceneLoader, Space, StandardMaterial, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders/OBJ"
export class Game {
    scene: Scene;
    engine: Engine;
    camera: ArcRotateCamera;
    sphere: AbstractMesh;
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
        this.camera = new ArcRotateCamera("camera", 1, 1, 20, new Vector3(0, 0, 0));
        this.camera.attachControl(this.canvasElement, false);
        const light: HemisphericLight = new HemisphericLight("light", lightPosition, this.scene);
    }

    private async startPhysics() {
        const havokInstance = await HavokPhysics();
        const hk = new HavokPlugin(true, havokInstance);
        this.scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
        const glassMaterial = new StandardMaterial("glass");
        glassMaterial.transparencyMode = 3;
        glassMaterial.alpha = 0.2;
        const coords = this.getCoords(5);
        console.log(coords);
        coords.forEach(this.getSphere.bind(this));
        SceneLoader.ImportMeshAsync("", "/assets/", "sphere.obj", this.scene).then((res) => {
            const mesh = res.meshes.find(a => (a.name.startsWith("sphere")));
            mesh.material = glassMaterial;
            console.log(mesh)
            this.sphere = mesh;
            new PhysicsAggregate(mesh, PhysicsShapeType.MESH, { mass: 0, restitution: 0.5, friction: 1, rotation: this.sphere.rotationQuaternion }, this.scene);
        })
    }

    private getSphere(coords: number[], index: number) {
        const [x, y, z]: number[] = coords;
        const smallSphere = CreateSphere("ssphere" + index, { diameter: 1 }, this.scene);
        smallSphere.position.set(x, y, z);
        new PhysicsAggregate(smallSphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 1 }, this.scene);
    }

    private getCoords(bounds: number, total: number = 5): number[][] {
        const vertices: number[][] = [];
        const step = 1;
        for (let i: number = -bounds / 2; i < bounds / 2; i += step)
            for (let j: number = -bounds / 2; j < bounds / 2; j += step)
                for (let k: number = -bounds / 2; k < bounds / 2; k += step) {
                    vertices.push([i, j, k]);
                    if (vertices.length >= total) {
                        return vertices;
                    }
                }
        return vertices;
    }

    private startRenderCycle(): void {
        this.engine.runRenderLoop(this.update.bind(this));
    }

    private update(): void {
        if(this.sphere){
            const rot = this.sphere.rotation.clone();
            this.sphere.rotation = new Vector3(rot.x + 0.05, rot.y + 0.05, rot.z + 0.05)
        }
        this.scene.render();
    }
}