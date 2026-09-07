import { useEffect, useState } from 'react';

type Publicacion = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const API_URL = "https://jsonplaceholder.typicode.com/";

export default function ListaPublicaciones() {

    const [publicaciones, setPublicaciones] = useState<Array<Publicacion>>([]);

    async function cargarDatos(): Promise<void> {
        const respuesta = await fetch(API_URL + "posts");
        const datos: Array<Publicacion> = await respuesta.json();

        setPublicaciones(datos);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <ul>
            {publicaciones.map((post) => (
                <li key={post.id}>
                    {post.title}
                </li>
            ))}
        </ul>
    );
}