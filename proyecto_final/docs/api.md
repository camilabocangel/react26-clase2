# API HTTP REST

Base URL: la misma del sitio publicado (frontend y backend comparten dominio y puerto).
Todas las rutas están bajo `/api`. Todas las respuestas son JSON.

## POST /api/partidas

Crea una partida nueva con el estado inicial (100 de vida, 20 de energía para cada jugador,
ronda 1). Se arranca con algo de energía para que se pueda atacar desde la primera ronda sin
tener que esperar varios turnos cargando.

**Entrada**: sin cuerpo.

**Salida** (201 Created), capturada con `curl` contra el servidor real:

```json
{
  "id": "tyer0cn",
  "ronda": 1,
  "estado": "jugando",
  "ganador": null,
  "jugador1": { "vida": 100, "energia": 20 },
  "jugador2": { "vida": 100, "energia": 20 },
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

**Salida** (200 OK): partida actualizada, con `ultimaRonda` describiendo lo que pasó. Ejemplo
real (Jugador 1 atacó, Jugador 2 se defendió — por eso no hubo daño y a Jugador 1 le bajó la
energía en 20 igual):

```json
{
  "id": "tyer0cn",
  "ronda": 2,
  "estado": "jugando",
  "ganador": null,
  "jugador1": { "vida": 100, "energia": 0 },
  "jugador2": { "vida": 100, "energia": 20 },
  "ultimaRonda": {
    "accionJugador1": "atacar",
    "accionJugador2": "defender",
    "danioAJugador1": 0,
    "danioAJugador2": 0,
    "criticoContraJugador1": false,
    "criticoContraJugador2": false,
    "mensaje": "Jugador 1 ataca, pero el rival bloquea el golpe. Jugador 2 se defiende."
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
