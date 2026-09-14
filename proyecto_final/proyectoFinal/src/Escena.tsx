import { useEffect, useState } from 'react';
import type { Partida, ResultadoRonda } from './DueloNaves.tsx';

type PropiedadesEscena = {
    partida: Partida;
};

type PropiedadesBarra = {
    etiqueta: string;
    valor: number;
    tipo: 'vida' | 'energia';
};

function Barra({ etiqueta, valor, tipo }: PropiedadesBarra) {
    return (
        <div className="barra">
            <span className="barra-etiqueta">{etiqueta}: {valor}</span>
            <div className="barra-fondo">
                <div className={`barra-relleno barra-${tipo}`} style={{ width: `${valor}%` }}></div>
            </div>
        </div>
    );
}

export default function Escena({ partida }: PropiedadesEscena) {
    const [proyectilDerecha, setProyectilDerecha] = useState<number | null>(null);
    const [proyectilIzquierda, setProyectilIzquierda] = useState<number | null>(null);
    const [rondaMostrada, setRondaMostrada] = useState<ResultadoRonda | null>(null);

    if (partida.ultimaRonda !== rondaMostrada) {
        setRondaMostrada(partida.ultimaRonda);
        if (partida.ultimaRonda?.accionJugador1 === 'atacar') { setProyectilDerecha(0); }
        if (partida.ultimaRonda?.accionJugador2 === 'atacar') { setProyectilIzquierda(100); }
    }

    useEffect(() => {
        const movimiento = setInterval(() => {
            setProyectilDerecha((actual) => {
                if (actual === null) { return null; }
                const siguiente = actual + 14;
                return siguiente >= 100 ? null : siguiente;
            });
            setProyectilIzquierda((actual) => {
                if (actual === null) { return null; }
                const siguiente = actual - 14;
                return siguiente <= 0 ? null : siguiente;
            });
        }, 45);
        return () => clearInterval(movimiento);
    }, []);

    return (
        <div className="escena">
            <div className="nave nave-jugador1">
                <h2>Jugador 1</h2>
                <div className="icono-nave icono-jugador1"></div>
                <Barra etiqueta="Vida" valor={partida.jugador1.vida} tipo="vida" />
                <Barra etiqueta="Energía" valor={partida.jugador1.energia} tipo="energia" />
            </div>

            <div className="campo-batalla">
                {proyectilDerecha !== null && (
                    <div className="proyectil" style={{ left: `${proyectilDerecha}%` }}></div>
                )}
                {proyectilIzquierda !== null && (
                    <div className="proyectil" style={{ left: `${proyectilIzquierda}%` }}></div>
                )}
            </div>

            <div className="nave nave-jugador2">
                <h2>Jugador 2</h2>
                <div className="icono-nave icono-jugador2"></div>
                <Barra etiqueta="Vida" valor={partida.jugador2.vida} tipo="vida" />
                <Barra etiqueta="Energía" valor={partida.jugador2.energia} tipo="energia" />
            </div>
        </div>
    );
}
