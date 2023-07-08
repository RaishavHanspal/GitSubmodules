import { Game } from "./game"

document.addEventListener("DOMContentLoaded", (): void => {
    const canvasElement = document.getElementById("gameCanvas");
    new Game(canvasElement);
})