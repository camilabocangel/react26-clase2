import express from 'express';
import path from 'node:path';
import { crearPartida, obtenerPartida, jugarRonda, esAccionValida } from './partida.js';

const app = express();
const puerto = process.env.PORT ? Number(process.env.PORT) : 3000;
const carpetaFrontend = path.join(import.meta.dirname, '..', '..', 'proyectoFinal', 'dist');

app.use(express.json());
app.use(express.static(carpetaFrontend));

app.post('/api/partidas', (req, res) => {
    const partida = crearPartida();
    res.status(201).json(partida);
});

app.get('/api/partidas/:id', (req, res) => {
    const partida = obtenerPartida(req.params.id);
    if (!partida) {
        res.status(404).json({ error: 'No existe una partida con ese id.' });
        return;
    }
    res.json(partida);
});

app.post('/api/partidas/:id/turno', (req, res) => {
    const { accionJugador1, accionJugador2 } = req.body;

    if (!esAccionValida(accionJugador1) || !esAccionValida(accionJugador2)) {
        res.status(400).json({ error: 'Las acciones deben ser "atacar", "defender" o "cargar".' });
        return;
    }

    const resultado = jugarRonda(req.params.id, accionJugador1, accionJugador2);
    if (!resultado.ok) {
        res.status(400).json({ error: resultado.error });
        return;
    }
    res.json(resultado.partida);
});

app.use((req, res) => {
    res.sendFile(path.join(carpetaFrontend, 'index.html'));
});

app.listen(puerto, () => {
    console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});
