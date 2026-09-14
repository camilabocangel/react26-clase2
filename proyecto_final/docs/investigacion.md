# Investigación técnica

## Pruebas E2E: Playwright

**Por qué Playwright y no Cypress**: con la misma herramienta y casi la misma configuración
se puede correr la suite en modo headless (para GitHub Actions, con `npx playwright test`) y
en modo visual contra Chrome (`npx playwright test --headed --project=chromium`), que es
justo lo que pide el examen para la ejecución local durante la defensa.

**Cómo se configuró**:

- Carpeta independiente `proyecto_final/e2e` con su propio `package.json`
  (`@playwright/test`) y `playwright.config.ts`.
- `playwright.config.ts` define un `webServer` que primero compila el frontend
  (`npm run build --prefix ../proyectoFinal`) y luego arranca el backend
  (`npm start --prefix ../backend`), que es quien sirve la aplicación completa en
  `http://localhost:3000`. Así las pruebas siempre corren contra la app real (frontend
  compilado + servidor Express), nunca contra un simulacro.
- El navegador Chromium de Playwright se descarga aparte con
  `npx playwright install --with-deps chromium` (no viene incluido en el paquete npm).

**Cómo se ejecutan localmente**:

```bash
cd proyecto_final/e2e
npm install
npx playwright install --with-deps chromium
npx playwright test              # headless
npx playwright test --headed --project=chromium   # visual, para la defensa
```

**Qué cubren las 4 pruebas** (`duelo-naves.spec.ts`):

1. La pantalla de inicio muestra el título y el botón "Jugar" (inicio).
2. Al jugar, el backend crea la partida y la interfaz muestra a ambos jugadores
   (interacción principal + comunicación con el backend).
3. Una acción inválida (atacar sin energía) es rechazada por el servidor y el mensaje de
   error aparece en pantalla (caso de validación).
4. Una ronda válida (cargar/cargar) se resuelve contra el backend real y la energía
   mostrada en pantalla cambia según lo que devolvió el servidor (comunicación con el
   backend).

**Limitaciones encontradas**: el binario de Chromium para Playwright pesa varios cientos de
MB y debe descargarse en cada entorno nuevo (incluido GitHub Actions, donde el workflow
`duelo-naves-e2e.yml` lo instala en cada corrida); no se encontró forma de evitarlo sin cambiar
de herramienta.

## Publicación: Render

Se investigó Render (https://render.com/) porque lo recomienda el propio examen y porque
permite desplegar un servicio Node.js sin Docker, con un plan gratuito.

**Cómo funciona para este proyecto**: Render ofrece "Web Services": se conecta el
repositorio de GitHub y se define un comando de build y uno de arranque. Como el repositorio
tiene muchas carpetas de clases anteriores, se debe apuntar Render a los comandos que
instalan y compilan solo `proyecto_final`:

- **Build Command**:
  `cd proyecto_final/proyectoFinal && npm install && npm run build && cd ../backend && npm install`
- **Start Command**: `cd proyecto_final/backend && npm start`
- **Variables de entorno**: Render define automáticamente `PORT`; el servidor
  (`server.ts`) ya lo lee con `process.env.PORT`, con `3000` como valor por defecto para
  desarrollo local.
- No se usa Docker: Render puede construir y correr un proyecto Node.js directamente con los
  comandos anteriores, y el examen indica que Docker es opcional.

**Deploy automático desde GitHub Actions**: además de la integración nativa de Render (que
redeploya solo con cada push), se agregó el workflow `duelo-naves-deploy.yml`, que llama al
"Deploy Hook" de Render (una URL privada que dispara un nuevo deploy) y luego verifica que la
URL pública responda. Esto deja evidencia verificable en GitHub Actions de que el deploy se
disparó y de que la aplicación quedó accesible.

**Pendiente (requiere una cuenta de Render, que el asistente de IA no puede crear)**:

1. Crear una cuenta en Render y un "Web Service" apuntando a este repositorio.
2. Configurar el Build Command y el Start Command de arriba.
3. Copiar la URL pública del servicio y guardarla como la variable de repositorio
   `RENDER_APP_URL` en GitHub (Settings → Secrets and variables → Actions → Variables).
4. Copiar el "Deploy Hook" del servicio (Settings del servicio en Render) y guardarlo como el
   secreto de repositorio `RENDER_DEPLOY_HOOK_URL`.
5. Actualizar el enlace de despliegue en el `README.md` una vez publicada la URL real.

## Registro del uso de IA

Este proyecto se desarrolló con **Claude Code** (modelo Claude Sonnet 5) como asistente,
siguiendo estos pasos:

1. Se le pidió auditar el repositorio completo antes de escribir código: revisó los
   `package.json`, `tsconfig.json`, componentes de React existentes
   (`TresEnRaya.tsx`, `SpaceInvaders.tsx`, `Serpiente.tsx`, `ListaPublicaciones.tsx`), el
   backend de referencia (`clase_07_09_V2/backend`), los workflows de GitHub Actions y el
   tema de CSS compartido, para identificar qué tecnologías y patrones ya se usaban en la
   materia.
2. Con esa base, propuso 3 ideas de juego originales (Duelo de Naves, Carrera de Sabotaje,
   Asedio de Fortalezas) y una arquitectura, y se detuvo a pedir confirmación antes de
   escribir cualquier archivo. Se confirmó "Duelo de Naves" y Playwright como herramienta de
   pruebas E2E.
3. Generó el backend (`partida.ts`, `server.ts`), el frontend (`App.tsx`, `DueloNaves.tsx`,
   `Escena.tsx` y sus CSS), la configuración de Playwright y las pruebas, y los tres
   workflows de GitHub Actions, reutilizando los mismos patrones ya vistos en el repositorio
   (componentes de función con `useState`/`useEffect`, `fetch` nativo, CSS propio con las
   mismas variables de color, Express con rutas simples).
4. Se verificó cada pieza antes de continuar: `npm run build` y `npm run lint` en el
   frontend, `npm run typecheck` y `npm run lint` en el backend, pruebas manuales de los
   endpoints con `curl` (crear partida, consultar partida, ronda válida, ronda inválida), y
   la suite completa de Playwright en modo headless contra la aplicación real.
5. Lo que falta y no se le pidió a la IA que resolviera: crear la cuenta de Render y conectar
   el repositorio (requiere acceso a una cuenta personal), y la práctica de la defensa oral.

**Lo que el estudiante debe verificar antes de la defensa**: ejecutar el proyecto localmente
paso a paso, revisar `partida.ts` línea por línea (es el archivo con toda la lógica de
combate) y poder explicar por qué se tomó cada decisión técnica listada en
`decisiones.md`.
