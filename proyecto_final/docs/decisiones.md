# Decisiones del proyecto

## Boceto de pantalla

Pantalla de inicio (usa toda la ventana, centrada):

```
+--------------------------------------------------------------+
|                        Duelo de Naves                        |
|        Combate por turnos para 2 jugadores, mismo equipo     |
|                                                                |
|  - Atacar: cuesta energía, hace daño si no te defienden       |
|  - Defender: bloquea el daño de la ronda                      |
|  - Cargar: recupera energía                                   |
|                                                                |
|                        [   Jugar   ]                          |
+--------------------------------------------------------------+
```

Pantalla de partida (usa toda la ventana):

```
+--------------------------------------------------------------+
|  Jugador 1        |                        |     Jugador 2   |
|   [nave]           |     (proyectil ->)     |      [nave]     |
|  Vida  [======  ]  |                        | [  ======] Vida |
|  Energ [===     ]  |                        | [     ===] Energ|
|--------------------------------------------------------------|
|              Ronda 3 - Jugador 1, elige tu acción             |
|                 Jugador 2 bloquea el ataque.                  |
|          [ Atacar ]   [ Defender ]   [ Cargar ]               |
+--------------------------------------------------------------+
```

Pantalla de resultado (reemplaza el panel inferior cuando `estado === "terminada"`):

```
+--------------------------------------------------------------+
|                     Ganó el Jugador 2.                        |
|          [ Jugar de nuevo ]   [ Volver al inicio ]            |
+--------------------------------------------------------------+
```

## Decisiones técnicas y justificación

- **Pass-and-play en un solo dispositivo, sin modo contra el backend/IA**: el examen permite
  jugar "en el mismo dispositivo", así que se eligió esa opción para no necesitar
  WebSockets ni sondeo (`polling`) entre dos pestañas, lo que habría sido más código y más
  riesgo con el plazo de entrega tan ajustado.
- **Estado de la partida vive en Express, no en el navegador**: se guarda en un `Map` en
  memoria del servidor (`partida.ts`), indexado por un id generado con `Math.random()`. No se
  usa base de datos porque el examen no la exige y una partida solo necesita existir mientras
  el proceso del servidor sigue activo.
- **Un único endpoint para resolver la ronda** (`POST /api/partidas/:id/turno` con ambas
  acciones en el cuerpo): se decidió no crear un endpoint por jugador porque el juego es de
  un solo dispositivo — ambas elecciones siempre están listas antes de llamar al backend, y
  un solo POST hace que el servidor resuelva todo de forma atómica.
- **Express sirve el frontend compilado** (`express.static` + `res.sendFile` como
  comodín) en vez de correr dos servidores: cumple el requisito de "mismo dominio y puerto" y
  evita configurar CORS, que no está instalado en el repositorio.
- **`tsx` también en producción** (en vez de compilar con `tsc` y correr `node dist/`): el
  backend de referencia de la clase (`clase_07_09_V2/backend`) ya usa `tsx watch` solo para
  desarrollo. Compilar con `tsc` exigía ajustar `rootDir` y el tipo de módulo (ESM/CommonJS)
  del `package.json`; usar `tsx` en el script `start` evita esa complejidad y mantiene el
  mismo motor en desarrollo y producción.
- **Proxy de Vite (`server.proxy` en `vite.config.ts`) hacia `http://localhost:3000`**: para
  poder seguir usando `npm run dev` (con recarga en caliente) durante el desarrollo sin que
  las llamadas `fetch('/api/...')` fallen por CORS o por apuntar a un puerto equivocado. Es
  una opción nativa de Vite, no una librería nueva.
- **Sin librerías de estado ni de UI**: todo el estado del frontend es `useState`, igual que
  en `TresEnRaya.tsx` y `Serpiente.tsx`. No se usó Context ni ningún gestor externo porque el
  árbol de componentes es pequeño (`App` → `DueloNaves` → `Escena`).

## Riesgos técnicos y cómo se redujeron

- **Riesgo**: que el jugador ataque sin energía suficiente y el juego quede en un estado
  inconsistente. **Mitigación**: la validación vive en el backend (`partida.ts`), que
  rechaza la ronda completa (ninguna acción se aplica) si cualquiera de las dos acciones es
  inválida, y React muestra el mensaje de error devuelto por el servidor.
- **Riesgo**: no llegar a tiempo a configurar el despliegue por el plazo de entrega ajustado
  (16 sept 2026, 16:00 hora Bolivia). **Mitigación**: se eligió Render porque no requiere
  Docker ni tarjetas de crédito para un plan gratuito, y se documentó el procedimiento exacto
  en `investigacion.md` para poder repetirlo rápido.
- **Riesgo**: los mensajes de que "un jugador debe pasar el dispositivo al otro" podrían
  confundir en la defensa. **Mitigación**: la interfaz siempre indica explícitamente de quién
  es el turno ("Jugador 1, elige tu acción" / "Pasa el dispositivo al Jugador 2").

## Cambios importantes durante el desarrollo

- Se cambió el catch-all de Express para servir `index.html` de `app.get('/*splat', ...)` a
  `app.use((req, res) => ...)`: Express 5 usa una versión de `path-to-regexp` que ya no
  acepta un comodín `*` suelto en `app.get`, y `app.use` sin patrón de ruta evita ese
  problema sin perder la funcionalidad.
- Se movió la creación inicial de la partida (dentro de un `useEffect`) de una llamada a una
  función que reseteaba estado de forma síncrona, a una función asíncrona autoejecutada
  (`(async () => {...})()`) dentro del propio efecto: la configuración de ESLint del proyecto
  (heredada de la plantilla de Vite) incluye una regla nueva (`react-hooks/set-state-in-effect`)
  que falla si se llama a un `set` de estado de forma síncrona dentro de un efecto.
- Por la misma razón, en `Escena.tsx` la animación del proyectil se dejó de disparar con un
  `useEffect` que comparaba `partida.ultimaRonda`, y se cambió por el patrón recomendado por
  React de "ajustar el estado durante el renderizado" (comparar contra un valor guardado en
  `useState` directamente en el cuerpo del componente), que sí cumple esa regla de lint.
