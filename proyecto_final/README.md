# Duelo de Naves

Proyecto final de Certificación: juego web de 2 jugadores (mismo dispositivo) con frontend
en React + TypeScript y backend en Express + TypeScript, comunicados por HTTP/JSON con
`fetch`. Ver la documentación completa de diseño en [`docs/`](docs/).

## Requisitos

- Node.js 20 o superior
- npm

## Estructura

```
proyecto_final/
├── proyectoFinal/   # frontend: React + TypeScript + Vite
├── backend/         # backend: Express + TypeScript
├── e2e/             # pruebas end-to-end con Playwright
├── docs/            # documentación del proyecto (reglas, API, decisiones, investigación)
└── README.md
```

## Arquitectura

React sólo representa el estado del juego y llama a la API de Express con `fetch`; Express
es quien crea la partida, valida cada acción, calcula el resultado de cada ronda (con un
factor aleatorio de golpe crítico) y decide cuándo termina la partida. En producción, y
también al ejecutar `npm start` en `backend/`, Express sirve el frontend ya compilado
(`proyectoFinal/dist`) además de la API, por lo que todo corre en el mismo dominio y puerto.
Ver el detalle de responsabilidades en [`docs/reglas.md`](docs/reglas.md).

## Instalación y ejecución en desarrollo

En dos terminales:

```bash
# Terminal 1: backend (API en el puerto 3000)
cd proyecto_final/backend
npm install
npm run dev

# Terminal 2: frontend (Vite en el puerto 5173, con recarga en caliente)
cd proyecto_final/proyectoFinal
npm install
npm run dev
```

Abre `http://localhost:5173`. El frontend llama a `/api/...`, que Vite redirige al backend
en el puerto 3000 (ver `server.proxy` en `vite.config.ts`).

## Ejecución como se despliega (un solo puerto)

```bash
cd proyecto_final/proyectoFinal
npm install
npm run build

cd ../backend
npm install
npm start
```

Abre `http://localhost:3000`: ahí Express sirve el frontend compilado y la API juntos.

## Pruebas E2E (Playwright)

```bash
cd proyecto_final/e2e
npm install
npx playwright install --with-deps chromium

npx playwright test                                # headless (igual que en GitHub Actions)
npx playwright test --headed --project=chromium     # visual en Chrome, para la defensa
```

Las pruebas compilan el frontend y levantan el backend automáticamente
(`webServer` en `playwright.config.ts`) antes de correr.

## Linting

```bash
cd proyecto_final/proyectoFinal && npm run lint
cd proyecto_final/backend && npm run lint && npm run typecheck
```

## API (resumen)

Todas las rutas bajo `/api` reciben y devuelven JSON. Detalle completo con ejemplos en
[`docs/api.md`](docs/api.md).

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/partidas` | Crea una partida nueva |
| GET | `/api/partidas/:id` | Consulta el estado actual de una partida |
| POST | `/api/partidas/:id/turno` | Envía la acción de ambos jugadores y resuelve la ronda |

## Variables de entorno

| Variable | Dónde | Descripción |
|---|---|---|
| `PORT` | backend | Puerto en el que escucha Express. Por defecto `3000`. Render la define automáticamente. |

## Despliegue

Publicado en Render: **<https://react26.onrender.com/>**
El procedimiento de publicación (Build Command, Start Command, variables) está documentado
en [`docs/investigacion.md`](docs/investigacion.md).

## Uso de IA

Este proyecto se desarrolló con la asistencia de Claude Code. El registro detallado de qué se
le pidió, qué generó y qué se verificó está en
[`docs/investigacion.md`](docs/investigacion.md#registro-del-uso-de-ia).
