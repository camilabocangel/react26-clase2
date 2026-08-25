"use strict";
const filas = 5;
const columnas = 5;
const bombas = 5;
let tablero = [];
let terminado = false;
const tabla = document.getElementById("tablero");
const mensaje3 = document.getElementById("mensaje");
function crearTablero() {
    tablero = [];
    tabla.innerHTML = "";
    terminado = false;
    mensaje.textContent = "Encuentra las bombas";
    for (let i = 0; i < filas; i++) {
        let fila = document.createElement("tr");
        tablero[i] = [];
        for (let j = 0; j < columnas; j++) {
            let casilla = document.createElement("td");
            casilla.addEventListener("click", function () {
                descubrir(i, j);
            });
            fila.appendChild(casilla);
            tablero[i][j] = {
                bomba: false,
                elemento: casilla
            };
        }
        tabla.appendChild(fila);
    }
    colocarBombas();
}
function colocarBombas() {
    let cantidad = 0;
    while (cantidad < bombas) {
        let fila = Math.floor(Math.random() * filas);
        let columna = Math.floor(Math.random() * columnas);
        if (!tablero[fila][columna].bomba) {
            tablero[fila][columna].bomba = true;
            cantidad++;
        }
    }
}
function descubrir(fila, columna) {
    if (terminado)
        return;
    let casilla = tablero[fila][columna];
    if (casilla.bomba) {
        explotar(fila, columna);
        terminado = true;
        mensaje.textContent = "💥 ¡BOOM! Perdiste";
        return;
    }
    casilla.elemento.textContent = "😊";
}
function explotar(fila, columna) {
    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            if (i >= 0 && i < filas && j >= 0 && j < columnas) {
                tablero[i][j].elemento.textContent = "💥";
                tablero[i][j].elemento.classList.add("explosion");
            }
        }
    }
}
document.getElementById("reiniciar").addEventListener("click", crearTablero);
crearTablero();
