import { GameAmmo } from "./ammo";
import { GameCannon } from "./cannon";
import { GameHavok } from "./havoc"
import { GameOimo } from "./oimo";

document.addEventListener("DOMContentLoaded", (): void => {
    const canvasElement = document.getElementById("gameCanvas");
    // new GameHavok(canvasElement);
    // new GameCannon(canvasElement);
    // new GameOimo(canvasElement);
    new GameAmmo(canvasElement);
})