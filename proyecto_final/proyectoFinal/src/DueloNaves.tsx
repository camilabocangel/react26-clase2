import { useEffect, useState } from 'react';
import Escena from './Escena.tsx';
import './DueloNaves.css';

export type Accion = 'atacar' | 'defender' | 'cargar';

export type EstadoJugador = {
    vida: number;
    energia: number;
};

export type ResultadoRonda = {
    accionJugador1: Accion;
    accionJugador2: Accion;
    danioAJugador1: number;
    danioAJugador2: number;
    criticoContraJugador1: boolean;
    criticoContraJugador2: boolean;
    mensaje: string;
};

export type Partida = {
    id: string;
    ronda: number;
    estado: 'jugando' | 'terminada';
    ganador: 'jugador1' | 'jugador2' | 'empate' | null;
    jugador1: EstadoJugador;
    jugador2: EstadoJugador;
    ultimaRonda: ResultadoRonda | null;
};

type Fase = 'esperando-jugador1' | 'esperando-jugador2' | 'resolviendo' | 'mostrando-resultado';

type PropiedadesDueloNaves = {
    alVolverAlInicio: () => void;
};

const DURACION_MENSAJE_MS = 2200;
const COSTO_ATAQUE = 30;

export default function DueloNaves({ alVolverAlInicio }: PropiedadesDueloNaves) {
    const [partida, setPartida] = useState<Partida | null>(null);
    const [fase, setFase] = useState<Fase>('esperando-jugador1');
    const [accionJugador1, setAccionJugador1] = useState<Accion | null>(null);
    const [error, setError] = useState<string | null>(null);

    const crearPartida = async (): Promise<void> => {
        setPartida(null);
        setError(null);
        setAccionJugador1(null);
        setFase('esperando-jugador1');
        const respuesta = await fetch('/api/partidas', { method: 'POST' });
        const datos: Partida = await respuesta.json();
        setPartida(datos);
    };

    useEffect(() => {
        let cancelado = false;
        (async () => {
            const respuesta = await fetch('/api/partidas', { method: 'POST' });
            const datos: Partida = await respuesta.json();
            if (!cancelado) { setPartida(datos); }
        })();
        return () => { cancelado = true; };
    }, []);

    useEffect(() => {
        if (fase !== 'mostrando-resultado' || !partida || partida.estado === 'terminada') { return; }
        const temporizador = setTimeout(() => setFase('esperando-jugador1'), DURACION_MENSAJE_MS);
        return () => clearTimeout(temporizador);
    }, [fase, partida]);

    const jugarTurno = async (accion1: Accion, accion2: Accion): Promise<void> => {
        if (!partida) { return; }
        setFase('resolviendo');
        const respuesta = await fetch(`/api/partidas/${partida.id}/turno`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accionJugador1: accion1, accionJugador2: accion2 }),
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            setError(datos.error);
            setAccionJugador1(null);
            setFase('esperando-jugador1');
            return;
        }

        setError(null);
        setPartida(datos);
        setAccionJugador1(null);
        setFase('mostrando-resultado');
    };

    const elegirAccion = (accion: Accion): void => {
        if (fase === 'esperando-jugador1') {
            setAccionJugador1(accion);
            setFase('esperando-jugador2');
            return;
        }
        if (fase === 'esperando-jugador2' && accionJugador1) {
            jugarTurno(accionJugador1, accion);
        }
    };

    if (!partida) {
        return <p className="cargando">Creando partida...</p>;
    }

    const jugadorEnTurno = fase === 'esperando-jugador1' ? 1 : 2;
    const puedeElegir = fase === 'esperando-jugador1' || fase === 'esperando-jugador2';
    const energiaJugadorEnTurno = jugadorEnTurno === 1 ? partida.jugador1.energia : partida.jugador2.energia;
    const puedeAtacar = energiaJugadorEnTurno >= COSTO_ATAQUE;

    return (
        <div className="duelo">
            <Escena partida={partida} />

            <div className="panel-control">
                {partida.estado === 'terminada' ? (
                    <div className="resultado-final">
                        <p className="mensaje-final">
                            {partida.ganador === 'empate'
                                ? 'Empate: ambas naves llegaron al límite de rondas igualadas.'
                                : `Ganó el ${partida.ganador === 'jugador1' ? 'Jugador 1' : 'Jugador 2'}.`}
                        </p>
                        {partida.ultimaRonda && <p className="mensaje-ronda">{partida.ultimaRonda.mensaje}</p>}
                        <div className="botones-final">
                            <button type="button" className="boton" onClick={crearPartida}>Jugar de nuevo</button>
                            <button type="button" className="boton boton-secundario" onClick={alVolverAlInicio}>Volver al inicio</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="turno-actual">
                            Ronda {partida.ronda} — {fase === 'resolviendo'
                                ? 'Resolviendo la ronda...'
                                : `Turno del Jugador ${jugadorEnTurno}`}
                        </p>
                        {jugadorEnTurno === 2 && fase === 'esperando-jugador2' && (
                            <p className="ayuda">Jugador 1 ya eligió en secreto. Pasa el dispositivo al Jugador 2.</p>
                        )}
                        {puedeElegir && !puedeAtacar && (
                            <p className="aviso-energia">
                                Jugador {jugadorEnTurno} tiene {energiaJugadorEnTurno} de energía: le faltan {COSTO_ATAQUE - energiaJugadorEnTurno} para poder atacar.
                            </p>
                        )}
                        {error && <p className="mensaje-error">⚠ {error}</p>}

                        <div className="botones-accion">
                            <button type="button" disabled={!puedeElegir} onClick={() => elegirAccion('atacar')}>
                                Atacar<span className="costo">-30 energía</span>
                            </button>
                            <button type="button" disabled={!puedeElegir} onClick={() => elegirAccion('defender')}>
                                Defender<span className="costo">bloquea el daño</span>
                            </button>
                            <button type="button" disabled={!puedeElegir} onClick={() => elegirAccion('cargar')}>
                                Cargar<span className="costo">+25 energía</span>
                            </button>
                        </div>

                        {partida.ultimaRonda && (
                            <p className="ronda-anterior">
                                <strong>Ronda anterior:</strong> {partida.ultimaRonda.mensaje}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
