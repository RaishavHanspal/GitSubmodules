import { AbstractMesh, ArcRotateCamera, Axis, CSG, CannonJSPlugin, CreateGround, CreateSphere, Engine, FreeCamera, GroundMesh, HavokPlugin, HemisphericLight, HingeConstraint, HingeJoint, LockConstraint, Matrix, Mesh, OimoJSPlugin, PhysicsAggregate, PhysicsImpostor, PhysicsJoint, PhysicsShapeType, Quaternion, Scene, SceneLoader, Space, StandardMaterial, Vector3, Vector4 } from "babylonjs";
import * as OIMO from "oimo";
import "babylonjs-loaders"
export class GameOimo {
    scene: Scene;
    engine: Engine;
    camera: ArcRotateCamera;
    sphere: AbstractMesh;
    constructor(private canvasElement: any) {
        this.init();
        this.startPhysics();
        this.startRenderCycle();
        (window as any).sceneObj = this;
    }

    private init(): void {
        this.engine = new Engine(this.canvasElement);
        this.scene = new Scene(this.engine);
        const lightPosition: Vector3 = new Vector3(0, 5, -10);
        this.camera = new ArcRotateCamera("camera", 1, 1, 20, new Vector3(0, 0, 0));
        this.camera.attachControl(this.canvasElement, false);
        const light: HemisphericLight = new HemisphericLight("light", lightPosition, this.scene);
    }

    private async startPhysics() {
        (window as any).OIMO = OIMO;
        const hk = new OimoJSPlugin()
        this.scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
        const glassMaterial = new StandardMaterial("glass");
        glassMaterial.transparencyMode = 3;
        glassMaterial.alpha = 0.2;
        const coords = this.getCoords(5, 50);
        console.log(coords);
        coords.forEach(this.getSphere.bind(this));
        SceneLoader.ImportMeshAsync("", "./assets/", "sphere.obj", this.scene).then((res) => {
            const mesh = res.meshes.find(a => (a.name.startsWith("sphere")));
            mesh.material = glassMaterial;
            console.log(mesh)
            this.sphere = mesh;
            mesh.checkCollisions = true;
            this.scene.collisionsEnabled = true;
            const ground = CreateGround("Ground", { width :10, height: 12}, this.scene);
            ground.position.y = -10;
            ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.5, friction: 1,},  this.scene);
            this.sphere.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.MeshImpostor, { mass: 1, restitution: 0.5, friction: 1 }, this.scene);
            /** constraint body */
            const smallSphere = CreateSphere("ssphereConstraint", { diameter: 0.25 }, this.scene);
            smallSphere.visibility = 0;
            smallSphere.physicsImpostor = new PhysicsImpostor(smallSphere, PhysicsShapeType.SPHERE, { mass: 0, restitution: 0.5, friction: 1 }, this.scene);
            /** constraint */
            const joint = new PhysicsJoint(PhysicsJoint.HingeJoint, {
                mainPivot: new Vector3(0, 0, 0),
                connectedPivot: new Vector3(-0.1, 0, 0),
                mainAxis: new Vector3(1, 0, 0),
                connectedAxis: new Vector3(1, 0, 0),
            });
            this.sphere.reIntegrateRotationIntoRotationQuaternion = true;
            smallSphere.physicsImpostor.addJoint(this.sphere.physicsImpostor, joint);
        })
    }

    private getSphere(coords: number[], index: number) {
        const [x, y, z]: number[] = coords;
        const smallSphere = CreateSphere("ssphere" + index, { diameter: 1 }, this.scene);
        smallSphere.position.set(x, y, z);
        smallSphere.checkCollisions = true;
        new PhysicsImpostor(smallSphere, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0 }, this.scene);
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
        if (this.sphere) {
            this.sphere.physicsImpostor.setAngularVelocity(new Vector3(2, 0, 0));
        }
        document.getElementById("fps").innerHTML = this.engine.getFps().toFixed() + " fps";
        this.scene.render();
    }
}