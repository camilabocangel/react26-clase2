export type Posicion = {
    fila: number;
    columna: number;
};

type PropiedadesTablero = {
    serpiente: Posicion[];
    comida: Posicion;
    filas: number;
    columnas: number;
};

export default function Tablero({ serpiente, comida, filas, columnas }: PropiedadesTablero) {
    const indicesFilas: number[] = Array.from({ length: filas }, (_, indice) => indice);
    const indicesColumnas: number[] = Array.from({ length: columnas }, (_, indice) => indice);

    const claseDeCelda = (fila: number, columna: number): string => {
        const posicion: number = serpiente.findIndex((segmento) => {
            return segmento.fila === fila && segmento.columna === columna;
        });
        if (posicion === 0) { return 'celda cabeza'; }
        if (posicion > 0) { return 'celda cuerpo'; }
        if (comida.fila === fila && comida.columna === columna) { return 'celda comida'; }
        return 'celda';
    };

    return (
        <table className="tablero">
            <tbody>
                {
                    indicesFilas.map((fila) => {
                        return (
                            <tr key={fila}>
                                {
                                    indicesColumnas.map((columna) => {
                                        return <td key={columna} className={claseDeCelda(fila, columna)}></td>;
                                    })
                                }
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}
