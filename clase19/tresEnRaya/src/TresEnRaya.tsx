import {useState} from 'react';

export default function TresEnRaya (){
    type marca = 'X' | 'O';
    type celda = marca | null;
    type tablero = celda [];
    const tableroInicial: tablero = Array<celda>(9).fill(null);
    console.log(tableroInicial);
    const [tablero, setTablero] = useState<tablero>(tableroInicial);
    const [turno, sertTurno] = useState<marca>('X');
    const marcarCelda = (indice:number):void =>{
        if(tablero[indice]!==null) {return};
        setTablero(tablero.map((celda, posicion) =>{
            return posicion === indice ? turno:celda;
        }));
        sertTurno(turno === 'X' ? 'O':'X');
    }
    return (
        <table>
            <tbody>
                {
                    [0,1,2].map((fila) => {
                        return(
                            <tr 
                                key={fila}>{tablero.slice(fila+3,fila+3+3).map((celda, columna)=><td key={columna}><button onClick = {()=>{marcarCelda(fila+3+columna);}}>{celda}</button></td>)}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}