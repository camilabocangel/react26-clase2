export default function EjemploLlaves() {
    const sumar=(a:number,b:number):number=>{
        return a+b
    }
    const mensaje:string = "HOLAAAAAA UPB"
    const suma:number = sumar(5,6)
    return (
        <section>
            <h1>{mensaje}</h1>
            <p>3+4={suma}</p>
        </section>
    )
}