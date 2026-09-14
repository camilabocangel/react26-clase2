# Reglas y arquitectura del juego

## Reglas

1. Ambos jugadores empiezan con 100 de vida y 0 de energía.
2. Cada ronda, cada jugador elige una acción: `atacar`, `defender` o `cargar`.
3. `atacar` cuesta 30 de energía. Si el jugador no tiene esa energía, el servidor rechaza la
   ronda completa y no cambia el estado (caso de acción inválida).
4. Si un jugador ataca y el rival **no** eligió `defender`, el rival recibe daño: 20 de daño
   normal, o 35 si el servidor calcula un golpe crítico (25% de probabilidad, decidido con
   `Math.random()` en el backend).
5. `defender` bloquea el 100% del daño de esa ronda, pero no gasta ni recupera energía.
6. `cargar` no ataca ni defiende: suma 25 de energía (hasta un máximo de 100).
7. Las dos acciones de la ronda se resuelven **al mismo tiempo** en el servidor: no importa
   quién "clickeó" primero en la pantalla, sino que ambas decisiones ya fueron elegidas.

## Condición de victoria

- **Gana** quien deje al rival con 0 de vida mientras conserva más de 0.
- **Empate** si ambos llegan a 0 de vida en la misma ronda, o si se llega a la ronda 15 con
  la misma vida en ambos.
- Si se llega a la ronda 15 con vidas distintas, gana quien tenga más vida.

## Elementos que se mueven

- El **proyectil** que representa un ataque viaja animado por la pantalla (de izquierda a
  derecha o de derecha a izquierda, según quién atacó), usando `useState` + `useEffect` con
  `setInterval` para actualizar su posición varias veces por segundo — el mismo patrón usado
  en `clase20/space_invaders/src/SpaceInvaders.tsx` para la bala del jugador.
- Las barras de vida y energía cambian de ancho (`width` en porcentaje) en cada ronda.

## Estados principales

| Estado | Dónde vive | Tipo |
|---|---|---|
| Vida de cada jugador | Express (autoridad) | número |
| Energía de cada jugador | Express (autoridad) | número |
| Ronda actual | Express (autoridad) | número |
| Resultado de la última ronda (mensaje, daño, crítico) | Express (autoridad) | objeto |
| Estado/ganador de la partida | Express (autoridad) | texto |
| Fase de selección local (esperando jugador 1/2, resolviendo) | React (solo interfaz) | texto |
| Posición del proyectil animado | React (solo interfaz) | número |

## Interacción entre jugadores

El estado de vida y energía es compartido: la acción de un jugador (atacar) reduce
directamente la vida del otro, y la acción de defender del otro anula ese efecto. Ninguno de
los dos puede modificar su propio resultado sin que el servidor lo calcule.

## Responsabilidades de React

- Mostrar la escena (naves, barras, proyectil animado).
- Recibir la elección de cada jugador (botones Atacar / Defender / Cargar).
- Guardar temporalmente la elección del Jugador 1 mientras el Jugador 2 elige.
- Llamar a la API de Express con `fetch` y mostrar la respuesta (incluyendo errores).
- Mostrar la pantalla de resultado final.

## Responsabilidades de Express

- Crear la partida (`POST /api/partidas`): genera el id y el estado inicial.
- Validar cada ronda (`POST /api/partidas/:id/turno`): rechaza acciones desconocidas,
  rechaza `atacar` sin energía suficiente, rechaza jugar sobre una partida ya terminada.
- Calcular el resultado de la ronda: aplicar daño, energía, y decidir el golpe crítico al
  azar.
- Guardar el estado de cada partida en memoria del servidor (no existe en el navegador antes
  de pedirlo).
- Decidir cuándo la partida termina y quién ganó.
- Servir el frontend ya compilado (`express.static`) para que todo funcione en el mismo
  dominio y puerto.
