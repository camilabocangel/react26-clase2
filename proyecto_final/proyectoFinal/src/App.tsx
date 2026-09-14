import { useState } from 'react';
import DueloNaves from './DueloNaves.tsx';
import './App.css';

type Pantalla = 'inicio' | 'juego';

export default function App() {
    const [pantalla, setPantalla] = useState<Pantalla>('inicio');

    if (pantalla === 'juego') {
        return <DueloNaves alVolverAlInicio={() => setPantalla('inicio')} />;
    }

    return (
        <div className="inicio">
            <h1>Duelo de Naves</h1>
            <p className="subtitulo">Combate por turnos para 2 jugadores, en el mismo dispositivo.</p>

            <ul className="instrucciones">
                <li><strong>Atacar</strong>: cuesta 30 de energía y hace daño (a veces crítico) si el rival no se defiende.</li>
                <li><strong>Defender</strong>: no gastas energía y bloqueas por completo el ataque de esa ronda.</li>
                <li><strong>Cargar</strong>: no ataca, pero recupera energía para poder atacar después.</li>
            </ul>
            <p className="subtitulo">
                Cada ronda, el Jugador 1 elige en secreto, luego el Jugador 2. El servidor resuelve
                el resultado y decide si hay golpe crítico. Gana quien deje al rival sin vida.
            </p>

            <button type="button" className="boton boton-jugar" onClick={() => setPantalla('juego')}>
                Jugar
            </button>
        </div>
    );
}
