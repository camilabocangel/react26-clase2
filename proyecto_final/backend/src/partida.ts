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

const VIDA_INICIAL = 100;
const ENERGIA_INICIAL = 0;
const ENERGIA_MAXIMA = 100;
const COSTO_ATAQUE = 30;
const DANIO_BASE = 20;
const DANIO_CRITICO = 35;
const PROBABILIDAD_CRITICO = 0.25;
const GANANCIA_CARGAR = 25;
const RONDA_LIMITE = 15;

const partidas = new Map<string, Partida>();

const generarId = (): string => {
    return Math.random().toString(36).slice(2, 9);
};

export const crearPartida = (): Partida => {
    const partida: Partida = {
        id: generarId(),
        ronda: 1,
        estado: 'jugando',
        ganador: null,
        jugador1: { vida: VIDA_INICIAL, energia: ENERGIA_INICIAL },
        jugador2: { vida: VIDA_INICIAL, energia: ENERGIA_INICIAL },
        ultimaRonda: null,
    };
    partidas.set(partida.id, partida);
    return partida;
};

export const obtenerPartida = (id: string): Partida | undefined => {
    return partidas.get(id);
};

export const esAccionValida = (accion: unknown): accion is Accion => {
    return accion === 'atacar' || accion === 'defender' || accion === 'cargar';
};

type JugarRondaExito = { ok: true; partida: Partida };
type JugarRondaError = { ok: false; error: string };

export const jugarRonda = (
    id: string,
    accionJugador1: Accion,
    accionJugador2: Accion,
): JugarRondaExito | JugarRondaError => {
    const partida = partidas.get(id);
    if (!partida) {
        return { ok: false, error: 'No existe una partida con ese id.' };
    }
    if (partida.estado === 'terminada') {
        return { ok: false, error: 'La partida ya terminó. Crea una partida nueva.' };
    }
    if (accionJugador1 === 'atacar' && partida.jugador1.energia < COSTO_ATAQUE) {
        return { ok: false, error: 'El jugador 1 no tiene suficiente energía para atacar.' };
    }
    if (accionJugador2 === 'atacar' && partida.jugador2.energia < COSTO_ATAQUE) {
        return { ok: false, error: 'El jugador 2 no tiene suficiente energía para atacar.' };
    }

    const seDefendioJugador1 = accionJugador1 === 'defender';
    const seDefendioJugador2 = accionJugador2 === 'defender';

    let danioAJugador1 = 0;
    let danioAJugador2 = 0;
    let criticoContraJugador1 = false;
    let criticoContraJugador2 = false;

    if (accionJugador2 === 'atacar') {
        partida.jugador2.energia -= COSTO_ATAQUE;
        if (!seDefendioJugador1) {
            criticoContraJugador1 = Math.random() < PROBABILIDAD_CRITICO;
            danioAJugador1 = criticoContraJugador1 ? DANIO_CRITICO : DANIO_BASE;
        }
    }

    if (accionJugador1 === 'atacar') {
        partida.jugador1.energia -= COSTO_ATAQUE;
        if (!seDefendioJugador2) {
            criticoContraJugador2 = Math.random() < PROBABILIDAD_CRITICO;
            danioAJugador2 = criticoContraJugador2 ? DANIO_CRITICO : DANIO_BASE;
        }
    }

    if (accionJugador1 === 'cargar') {
        partida.jugador1.energia = Math.min(ENERGIA_MAXIMA, partida.jugador1.energia + GANANCIA_CARGAR);
    }
    if (accionJugador2 === 'cargar') {
        partida.jugador2.energia = Math.min(ENERGIA_MAXIMA, partida.jugador2.energia + GANANCIA_CARGAR);
    }

    partida.jugador1.vida = Math.max(0, partida.jugador1.vida - danioAJugador1);
    partida.jugador2.vida = Math.max(0, partida.jugador2.vida - danioAJugador2);

    partida.ultimaRonda = {
        accionJugador1,
        accionJugador2,
        danioAJugador1,
        danioAJugador2,
        criticoContraJugador1,
        criticoContraJugador2,
        mensaje: construirMensaje(
            accionJugador1,
            accionJugador2,
            danioAJugador1,
            danioAJugador2,
            criticoContraJugador1,
            criticoContraJugador2,
        ),
    };

    definirSiTermino(partida);
    if (partida.estado === 'jugando') {
        partida.ronda += 1;
    }

    return { ok: true, partida };
};

const describirAccion = (nombre: string, accion: Accion, danioHecho: number, fueCritico: boolean): string => {
    if (accion === 'cargar') { return `${nombre} carga energía.`; }
    if (accion === 'defender') { return `${nombre} se defiende.`; }
    if (danioHecho > 0) {
        return `${nombre} ataca e inflige ${danioHecho} de daño${fueCritico ? ' (¡golpe crítico!)' : ''}.`;
    }
    return `${nombre} ataca, pero el rival bloquea el golpe.`;
};

const construirMensaje = (
    accionJugador1: Accion,
    accionJugador2: Accion,
    danioAJugador1: number,
    danioAJugador2: number,
    criticoContraJugador1: boolean,
    criticoContraJugador2: boolean,
): string => {
    const descripcionJugador1 = describirAccion('Jugador 1', accionJugador1, danioAJugador2, criticoContraJugador2);
    const descripcionJugador2 = describirAccion('Jugador 2', accionJugador2, danioAJugador1, criticoContraJugador1);
    return `${descripcionJugador1} ${descripcionJugador2}`;
};

const definirSiTermino = (partida: Partida): void => {
    const jugador1Derrotado = partida.jugador1.vida <= 0;
    const jugador2Derrotado = partida.jugador2.vida <= 0;

    if (jugador1Derrotado && jugador2Derrotado) {
        partida.estado = 'terminada';
        partida.ganador = 'empate';
        return;
    }
    if (jugador1Derrotado) {
        partida.estado = 'terminada';
        partida.ganador = 'jugador2';
        return;
    }
    if (jugador2Derrotado) {
        partida.estado = 'terminada';
        partida.ganador = 'jugador1';
        return;
    }
    if (partida.ronda >= RONDA_LIMITE) {
        partida.estado = 'terminada';
        if (partida.jugador1.vida === partida.jugador2.vida) {
            partida.ganador = 'empate';
        } else {
            partida.ganador = partida.jugador1.vida > partida.jugador2.vida ? 'jugador1' : 'jugador2';
        }
    }
};
