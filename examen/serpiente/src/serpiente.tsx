import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Tablero from './Tablero.tsx';
import type { Posicion } from './Tablero.tsx';

const FILAS: number = 8;
const COLUMNAS: number = 8;

type Estado = 'jugando' | 'perdido' | 'ganado';

const serpienteInicial: Posicion[] = [
    { fila: 4, columna: 3 },
    { fila: 4, columna: 2 },
    { fila: 4, columna: 1 },
];

const generarComida = (serpiente: Posicion[]): Posicion => {
    const libres: Posicion[] = [];
    for (let fila = 0; fila < FILAS; fila++) {
        for (let columna = 0; columna < COLUMNAS; columna++) {
            const ocupada: boolean = serpiente.some((segmento) => {
                return segmento.fila === fila && segmento.columna === columna;
            });
            if (!ocupada) { libres.push({ fila, columna }); }
        }
    }
    return libres[Math.floor(Math.random() * libres.length)];
};

export default function Serpiente() {
    const [serpiente, setSerpiente] = useState<Posicion[]>(serpienteInicial);
    const [comida, setComida] = useState<Posicion>(() => generarComida(serpienteInicial));
    const [estado, setEstado] = useState<Estado>('jugando');
    const [puntaje, setPuntaje] = useState<number>(0);

    const avanzar = (avanceFila: number, avanceColumna: number): void => {
        if (estado !== 'jugando') { return; }

        const cabeza: Posicion = serpiente[0];
        const nuevaCabeza: Posicion = {
            fila: cabeza.fila + avanceFila,
            columna: cabeza.columna + avanceColumna,
        };

        if (nuevaCabeza.fila < 0 || nuevaCabeza.fila >= FILAS ||
            nuevaCabeza.columna < 0 || nuevaCabeza.columna >= COLUMNAS) {
            setEstado('perdido');
            return;
        }

        const come: boolean = nuevaCabeza.fila === comida.fila && nuevaCabeza.columna === comida.columna;
        const cuerpo: Posicion[] = come ? serpiente : serpiente.slice(0, serpiente.length - 1);

        const choca: boolean = cuerpo.some((segmento) => {
            return segmento.fila === nuevaCabeza.fila && segmento.columna === nuevaCabeza.columna;
        });
        if (choca) {
            setEstado('perdido');
            return;
        }

        const nuevaSerpiente: Posicion[] = [nuevaCabeza, ...cuerpo];
        setSerpiente(nuevaSerpiente);

        if (come) {
            setPuntaje(puntaje + 1);
            if (nuevaSerpiente.length === FILAS * COLUMNAS) {
                setEstado('ganado');
            } else {
                setComida(generarComida(nuevaSerpiente));
            }
        }
    };

    const manejarTecla = (evento: KeyboardEvent<HTMLDivElement>): void => {
        switch (evento.key) {
            case 'ArrowUp':
                evento.preventDefault();
                avanzar(-1, 0);
                return;
            case 'ArrowDown':
                evento.preventDefault();
                avanzar(1, 0);
                return;
            case 'ArrowLeft':
                evento.preventDefault();
                avanzar(0, -1);
                return;
            case 'ArrowRight':
                evento.preventDefault();
                avanzar(0, 1);
                return;
            default:
                return;
        }
    };

    const reiniciar = (): void => {
        setSerpiente(serpienteInicial);
        setComida(generarComida(serpienteInicial));
        setEstado('jugando');
        setPuntaje(0);
    };

    return (
        <div className="juego" tabIndex={0} onKeyDown={manejarTecla} autoFocus>
            <h1>Serpiente</h1>
            <p className="marcador">Puntaje: {puntaje} | Segmentos: {serpiente.length}</p>

            <Tablero serpiente={serpiente} comida={comida} filas={FILAS} columnas={COLUMNAS} />

            {estado === 'jugando' && <p className="ayuda">Usa las flechas del teclado. Cada flecha es un turno.</p>}
            {estado === 'perdido' && <p className="mensaje perdido">Juego terminado. Puntaje final: {puntaje}</p>}
            {estado === 'ganado' && <p className="mensaje ganado">Ganaste, llenaste el tablero!</p>}

            <button type="button" className="reiniciar" onClick={reiniciar}>Reiniciar</button>
        </div>
    );
}
