const filas: number = 5;
const columnas: number = 5;
const bombas: number = 5;

let tablero: any[] = [];
let terminado: boolean = false;

const tabla = document.getElementById("tablero")!;
const mensaje3 = document.getElementById("mensaje")!;

function crearTablero(): void {

    tablero = [];
    tabla.innerHTML = "";
    terminado = false;
    mensaje3.textContent = "Encuentra las bombas";

    for (let i: number = 0; i < filas; i++) {

        let fila = document.createElement("tr");
        tablero[i] = [];

        for (let j: number = 0; j < columnas; j++) {

            let casilla = document.createElement("td");

            casilla.addEventListener("click", function() {
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

function colocarBombas(): void {

    let cantidad: number = 0;

    while (cantidad < bombas) {

        let fila: number = Math.floor(Math.random() * filas);
        let columna: number = Math.floor(Math.random() * columnas);

        if (!tablero[fila][columna].bomba) {

            tablero[fila][columna].bomba = true;
            cantidad++;
        }
    }
}

function descubrir(fila: number, columna: number): void {

    if (terminado) return;

    let casilla = tablero[fila][columna];

    if (casilla.bomba) {

        explotar(fila, columna);
        terminado = true;
        mensaje3.textContent = "💥 ¡BOOM! Perdiste";

        return;
    }

    casilla.elemento.textContent = "😊";
}

function explotar(fila: number, columna: number): void {

    for (let i: number = fila - 1; i <= fila + 1; i++) {

        for (let j: number = columna - 1; j <= columna + 1; j++) {

            if (i >= 0 && i < filas && j >= 0 && j < columnas) {

                tablero[i][j].elemento.textContent = "💥";
                tablero[i][j].elemento.classList.add("explosion");
            }
        }
    }
}

document.getElementById("reiniciar")!.addEventListener("click", crearTablero);

crearTablero();