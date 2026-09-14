# API HTTP REST

Base URL: la misma del sitio publicado (frontend y backend comparten dominio y puerto).
Todas las rutas están bajo `/api`. Todas las respuestas son JSON.

## POST /api/partidas

Crea una partida nueva con el estado inicial (100 de vida, 0 de energía, ronda 1).

**Entrada**: sin cuerpo.

**Salida** (201 Created):

```json
{
  "id": "5yqjnqb",
  "ronda": 1,
  "estado": "jugando",
  "ganador": null,
  "jugador1": { "vida": 100, "energia": 0 },
  "jugador2": { "vida": 100, "energia": 0 },
  "ultimaRonda": null
}
```

## GET /api/partidas/:id

Devuelve el estado actual de una partida existente. Se usa para no perder el progreso si la
página se recarga.

**Entrada**: `id` en la URL.

**Salida** (200 OK): el mismo objeto de partida mostrado arriba, con los valores actuales.

**Error** (404 Not Found):

```json
{ "error": "No existe una partida con ese id." }
```

## POST /api/partidas/:id/turno

Envía la acción elegida por cada jugador para la ronda actual. El servidor valida y resuelve
la ronda en un solo paso.

**Entrada**:

```json
{ "accionJugador1": "atacar", "accionJugador2": "defender" }
```

`accionJugador1` y `accionJugador2` deben ser `"atacar"`, `"defender"` o `"cargar"`.

**Salida** (200 OK): partida actualizada, con `ultimaRonda` describiendo lo que pasó:

```json
{
  "id": "5yqjnqb",
  "ronda": 2,
  "estado": "jugando",
  "ganador": null,
  "jugador1": { "vida": 100, "energia": 0 },
  "jugador2": { "vida": 80, "energia": 25 },
  "ultimaRonda": {
    "accionJugador1": "atacar",
    "accionJugador2": "defender",
    "danioAJugador1": 0,
    "danioAJugador2": 0,
    "criticoContraJugador1": false,
    "criticoContraJugador2": false,
    "mensaje": "Jugador 2 bloquea el ataque."
  }
}
```

**Errores** (400 Bad Request), la partida no cambia:

```json
{ "error": "El jugador 1 no tiene suficiente energía para atacar." }
```

```json
{ "error": "Las acciones deben ser \"atacar\", \"defender\" o \"cargar\"." }
```

```json
{ "error": "La partida ya terminó. Crea una partida nueva." }
```
