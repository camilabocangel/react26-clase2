# Serpiente (Snake) - React + TypeScript + Vite

Juego de la serpiente en un tablero de 8 filas x 8 columnas, representado con una tabla HTML
(`<table>`) y jugable con el teclado. Cada pulsacion de una flecha equivale a un turno.

## Reglas

- La serpiente empieza con 3 segmentos; el primero del arreglo es la cabeza.
- Cada flecha (arriba, abajo, izquierda, derecha) avanza la cabeza una celda.
- El cuerpo sigue a la cabeza: si no come, se elimina el ultimo segmento.
- La comida aparece en una celda aleatoria que no este ocupada por la serpiente (`Math.random`).
- Al llegar a la comida la serpiente crece un segmento y sube el puntaje.
- El juego termina si la serpiente sale del tablero o choca con su propio cuerpo.
- Con el boton **Reiniciar** se vuelve al estado inicial.

## Requisitos

- Node.js 20 o superior
- npm

## Instalacion

```bash
cd examen/serpiente
npm install
```

## Ejecucion en desarrollo

```bash
npm run dev
```

Abre la direccion que muestra la consola (por defecto <http://localhost:5173>).
Haz clic sobre el tablero para darle el foco y juega con las flechas del teclado.

## Compilar para produccion

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve la version compilada
```

## Estructura

```
examen/serpiente/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.tsx        # punto de entrada, monta <Serpiente />
    ├── serpiente.tsx   # estado del juego (useState), turnos y teclado
    ├── Tablero.tsx     # dibuja la tabla 8x8 con map y key
    ├── serpiente.css   # estilos de cabeza, cuerpo, comida y celdas
    └── index.css       # estilos base
```

## Publicacion en GitHub Pages

El juego se publica solo con cada push a `main` mediante el workflow
`.github/workflows/serpiente.yml` (compila `examen/serpiente` y sube `dist/` a Pages).
Por eso `vite.config.ts` usa `base: "/react26-clase2/"`.

URL: <https://camilabocangel.github.io/react26-clase2/>
