import { useEffect, useState } from 'react';
import type { Partida, ResultadoRonda } from './DueloNaves.tsx';

type PropiedadesEscena = {
    partida: Partida;
};

type PropiedadesBarra = {
    etiqueta: string;
    valor: number;
    maximo: number;
    tipo: 'vida' | 'energia';
};

function Barra({ etiqueta, valor, maximo, tipo }: PropiedadesBarra) {
    return (
        <div className="barra">
            <span className="barra-etiqueta">{etiqueta}: {valor}/{maximo}</span>
            <div className="barra-fondo">
                <div className={`barra-relleno barra-${tipo}`} style={{ width: `${(valor / maximo) * 100}%` }}></div>
            </div>
        </div>
    );
}

const DURACION_ANIMACION_MS = 1100;

export default function Escena({ partida }: PropiedadesEscena) {
    const [rondaMostrada, setRondaMostrada] = useState<ResultadoRonda | null>(null);
    const [ataqueJugador1Visible, setAtaqueJugador1Visible] = useState(false);
    const [ataqueJugador2Visible, setAtaqueJugador2Visible] = useState(false);

    if (partida.ultimaRonda !== rondaMostrada) {
        setRondaMostrada(partida.ultimaRonda);
        if (partida.ultimaRonda?.accionJugador1 === 'atacar') { setAtaqueJugador1Visible(true); }
        if (partida.ultimaRonda?.accionJugador2 === 'atacar') { setAtaqueJugador2Visible(true); }
    }

    useEffect(() => {
        if (!ataqueJugador1Visible) { return; }
        const temporizador = setTimeout(() => setAtaqueJugador1Visible(false), DURACION_ANIMACION_MS);
        return () => clearTimeout(temporizador);
    }, [ataqueJugador1Visible]);

    useEffect(() => {
        if (!ataqueJugador2Visible) { return; }
        const temporizador = setTimeout(() => setAtaqueJugador2Visible(false), DURACION_ANIMACION_MS);
        return () => clearTimeout(temporizador);
    }, [ataqueJugador2Visible]);

    return (
        <div className="escena">
            <div className="nave nave-jugador1">
                <h2>Jugador 1</h2>
                <div className="icono-nave icono-jugador1"></div>
                <Barra etiqueta="Vida" valor={partida.jugador1.vida} maximo={100} tipo="vida" />
                <Barra etiqueta="Energía" valor={partida.jugador1.energia} maximo={100} tipo="energia" />
            </div>

            <div className="campo-batalla">
                <div className="linea-central"></div>
                {ataqueJugador1Visible && <div className="proyectil proyectil-derecha"></div>}
                {ataqueJugador2Visible && <div className="proyectil proyectil-izquierda"></div>}
            </div>

            <div className="nave nave-jugador2">
                <h2>Jugador 2</h2>
                <div className="icono-nave icono-jugador2"></div>
                <Barra etiqueta="Vida" valor={partida.jugador2.vida} maximo={100} tipo="vida" />
                <Barra etiqueta="Energía" valor={partida.jugador2.energia} maximo={100} tipo="energia" />
            </div>
        </div>
    );
}
