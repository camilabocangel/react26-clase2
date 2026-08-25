console.log("esto es un buscaminas")
let tabla= document.querySelector<HTMLTableElement>(".buscaminas")
if(tabla){
    console.log(tabla.tagName)
    console.log(tabla.classList)
}
let celda= document.querySelector<HTMLTableCellElement>("td")
if(celda){
    console.log(celda.textContent)
} else {
    console.log("no hay celdas")
}
let listaElementos= document.querySelectorAll("td")
for (const elemento of listaElementos){
    elemento.addEventListener('click', function(){
        console.log(elemento.textContent)
        console.log(elemento.classList.value)

        if(elemento.classList.contains("mina")){
            for (const item of listaElementos){
                item.textContent = "💥"
                item.style.color = "gray"
            }
        }
        elemento.style.color = "gray"
    })
}