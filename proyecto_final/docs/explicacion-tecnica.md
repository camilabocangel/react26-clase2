# Cómo funciona el proyecto (front + back), con referencias exactas

Este documento es una guía rápida para la defensa: explica el flujo completo del juego y,
para las preguntas típicas del tipo *"¿dónde se hace X?"*, da el archivo y la línea exacta.

## 1. El flujo completo de una ronda, paso a paso

1. El jugador hace clic en un botón (Atacar / Defender / Cargar).
   → `DueloNaves.tsx`, función `elegirAccion` (líneas 96-105).
2. Si era el Jugador 1, su elección se guarda en el estado `accionJugador1` de React
   (`useState` en la línea 44) y la interfaz pasa a la fase `esperando-jugador2`. **Nada se
   envía todavía al servidor.**
3. Cuando el Jugador 2 elige, React ya tiene las dos acciones y llama a `jugarTurno`
   (líneas 73-94), que hace un `fetch` real:
   ```ts
   fetch(`/api/partidas/${partida.id}/turno`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ accionJugador1: accion1, accionJugador2: accion2 }),
   })
   ```
   (`DueloNaves.tsx`, líneas 76-80).
4. Esa petición HTTP la recibe Express en `server.ts`, ruta
   `app.post('/api/partidas/:id/turno', ...)` (líneas 26-40).
5. Express llama a `jugarRonda(...)` (`partida.ts`, líneas 69-145), que es **la única función
   que conoce y aplica las reglas del juego**: valida, calcula daño, energía, golpe crítico,
   y decide si la partida terminó.
6. Express responde con el objeto `Partida` completo y actualizado, en JSON
   (`res.json(resultado.partida)`, `server.ts` línea 39).
7. React recibe esa respuesta, la guarda con `setPartida(datos)`
   (`DueloNaves.tsx` línea 91) y **React vuelve a dibujar la pantalla con los números que
   mandó el servidor** — React nunca calcula vida ni energía por su cuenta.
8. `Escena.tsx` detecta que `partida.ultimaRonda` cambió y dispara la animación del
   proyectil (ver sección 3).

En una frase: **React solo junta las dos elecciones y pregunta al servidor qué pasó; Express
es quien decide todo.**

## 2. Preguntas del tipo "¿dónde se hace...?"

| Pregunta | Respuesta | Dónde (archivo y línea) |
|---|---|---|
| ¿Dónde se resta la vida después de un ataque? | `partida.jugador1.vida = Math.max(0, partida.jugador1.vida - danioAJugador1)` (y lo mismo para jugador2) | `partida.ts:119-120` |
| ¿Dónde se calcula cuánto daño hace un ataque? | Si el rival no se defendió, se tira el dado del crítico y se asigna `DANIO_CRITICO` o `DANIO_BASE` | `partida.ts:96-101` (daño de Jugador 2 hacia Jugador 1) y `partida.ts:104-110` (daño de Jugador 1 hacia Jugador 2) |
| ¿Dónde se decide si un golpe es crítico? | `Math.random() < PROBABILIDAD_CRITICO` (25% de probabilidad) | `partida.ts:99` y `partida.ts:107` |
| ¿Dónde se cobra la energía al atacar? | `partida.jugador2.energia -= COSTO_ATAQUE` (y lo mismo para jugador1) — se descuenta *aunque el ataque sea bloqueado*, porque el costo es por intentarlo | `partida.ts:97` y `partida.ts:105` |
| ¿Dónde se carga (suma) energía? | `Math.min(ENERGIA_MAXIMA, partida.jugadorX.energia + GANANCIA_CARGAR)` — el `Math.min` evita pasarse de 100 | `partida.ts:112-117` |
| ¿Dónde se valida que haya energía antes de atacar? | Se revisa **antes** de tocar cualquier estado; si falla, se corta con `return` y la partida no cambia nada | `partida.ts:81-86` |
| ¿Qué pasa si `defender` bloquea? | Si el rival se defendió (`seDefendioJugador1`/`2` es `true`), el `if` que calcula daño ni se ejecuta — el daño se queda en 0 | `partida.ts:98` y `partida.ts:106` |
| ¿Dónde se arma el texto de lo que pasó en la ronda? | `describirAccion` construye una frase por jugador, `construirMensaje` las junta | `partida.ts:147-167` |
| ¿Dónde se decide quién ganó, empató o si sigue jugando? | `definirSiTermino`: revisa vida en 0 de cada uno, y si se llega a la ronda límite, compara vidas | `partida.ts:169-196` |
| ¿Dónde vive el estado de cada partida? | Un `Map<string, Partida>` en memoria del proceso de Express — no hay base de datos | `partida.ts:38` |
| ¿Cómo se identifica cada partida? | Un id aleatorio con `Math.random().toString(36)` | `partida.ts:40-42` |
| ¿Dónde entra la petición HTTP de "crear partida"? | `app.post('/api/partidas', ...)` llama a `crearPartida()` | `server.ts:12-15` |
| ¿Dónde entra la petición HTTP de "jugar ronda"? | `app.post('/api/partidas/:id/turno', ...)` | `server.ts:26-40` |
| ¿Dónde se valida el formato de las acciones que llegan del cliente? | `esAccionValida` comprueba que sea `"atacar"`, `"defender"` o `"cargar"` antes de confiar en el `body` | `partida.ts:62-64`, usado en `server.ts:29` |
| ¿Dónde sirve Express el frontend ya compilado? | `express.static(carpetaFrontend)` para archivos, y un `app.use` final que manda `index.html` para cualquier otra ruta | `server.ts:10` y `server.ts:42-44` |
| ¿Dónde hace React el `fetch` para crear la partida? | Dentro de un `useEffect` que corre una sola vez al montar el componente (`[]` de dependencias) | `DueloNaves.tsx:57-65` |
| ¿Dónde hace React el `fetch` para jugar una ronda? | Función `jugarTurno` | `DueloNaves.tsx:73-94` |
| ¿Cómo sabe React si el servidor rechazó la jugada? | Revisa `respuesta.ok` (falso si el status HTTP es 4xx); si es falso, muestra `datos.error` que mandó Express | `DueloNaves.tsx:83-88` |
| ¿Dónde se guarda la elección del Jugador 1 mientras espera al Jugador 2? | Estado local `accionJugador1` (`useState`), **solo existe en el navegador hasta que ambos eligieron** | `DueloNaves.tsx:44` (declaración) y `:96-105` (uso) |
| ¿Dónde aparece el aviso de "te falta energía" antes de elegir? | Se calcula comparando la energía actual del jugador en turno contra `COSTO_ATAQUE`, **en el frontend**, solo para avisar — el rechazo real sigue siendo del backend | `DueloNaves.tsx:113-114` (cálculo) y `:144-148` (mensaje) |
| ¿Dónde se dispara la animación del proyectil? | Se compara `partida.ultimaRonda` contra el último que ya se mostró; si cambió y hubo un `"atacar"`, se pone en `true` el estado que hace aparecer el `<div className="proyectil">` | `Escena.tsx:34-38` |
| ¿Qué hace que el proyectil se mueva y no solo aparezca? | Una animación CSS (`@keyframes vuelo-derecha` / `vuelo-izquierda`) de 1.1 segundos aplicada por clase | `DueloNaves.css` (busca `@keyframes`) |
| ¿Dónde se hace desaparecer el proyectil al terminar la animación? | Un `setTimeout` de la misma duración que la animación CSS (1100 ms), dentro de un `useEffect` | `Escena.tsx:40-50` |
| ¿Dónde se decide cuántos jugadores hay y qué controla cada uno? | No hay lógica especial: el mismo componente `DueloNaves` sirve para los dos, alternando de quién es el turno con el estado `fase` | `DueloNaves.tsx:32` (tipo `Fase`) y `:42-43` |

## 3. Los "tres estados" que pide el examen (y dónde están)

El examen pide relacionar al menos tres tipos de estado. En este proyecto son:

1. **Vida** de cada jugador — vive en Express (`EstadoJugador.vida`, `partida.ts:4`), se
   modifica solo dentro de `jugarRonda`.
2. **Energía** de cada jugador — vive en Express (`EstadoJugador.energia`, `partida.ts:5`),
   se modifica solo dentro de `jugarRonda`.
3. **Ronda / turno** — el número de ronda vive en Express (`partida.ts:20` del tipo, se
   incrementa en `partida.ts:140-142`); **de quién es el turno ahora mismo** (`fase`) vive
   solo en React (`DueloNaves.tsx:32`), porque es una decisión de interfaz, no de las reglas
   del juego.
4. (extra) **Resultado de la última ronda** (`ultimaRonda`) — lo arma Express
   (`partida.ts:122-137`) y React solo lo muestra.

## 4. Por qué los tipos (`Accion`, `Partida`, etc.) están duplicados en frontend y backend

`DueloNaves.tsx` (líneas 5-30) y `partida.ts` (líneas 1-26) definen los mismos tipos de
TypeScript por separado. Es intencional: frontend y backend son dos proyectos con su propio
`package.json`, no hay ningún paquete compartido entre ellos (igual que el resto de las
carpetas de la materia), así que la única forma en que "se ponen de acuerdo" es el contrato
JSON que viaja por HTTP — documentado en `docs/api.md`. Si mañana se agrega un campo nuevo en
`partida.ts`, hay que recordar agregarlo también del lado de React.

## 5. Qué pasa si el docente pide un cambio en vivo

La lógica de combate está **toda** en una sola función, `jugarRonda` (`partida.ts:69-145`),
que además usa constantes con nombre al principio del archivo (`partida.ts:28-36`). Por
ejemplo, para cambiar cuánto cuesta atacar alcanza con editar `COSTO_ATAQUE` en esa línea (y
la misma constante, duplicada por claridad, en `DueloNaves.tsx:39`, que solo la usa para
mostrar el aviso). Para cambiar la probabilidad de crítico, `PROBABILIDAD_CRITICO`. Ninguno de
estos cambios toca el frontend salvo que también se quiera actualizar el número que se
muestra en el botón.
