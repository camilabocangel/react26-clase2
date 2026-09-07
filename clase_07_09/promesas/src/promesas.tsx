export default function Promesas() {

    async function cargarPost(): Promise<void> {

        const respuesta = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1"
        );

        console.log(respuesta.json());
    }

    cargarPost();

    return (
        <div>
            <h1>Promesas</h1>
        </div>
    );
}