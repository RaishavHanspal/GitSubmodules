import { GameCannon } from "./cannon";
import { GameHavok } from "./havoc"

document.addEventListener("DOMContentLoaded", (): void => {
    const canvasElement = document.getElementById("gameCanvas");
    new GameHavok(canvasElement);
    // new GameCannon(canvasElement);
})