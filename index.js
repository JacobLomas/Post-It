import{Controlador} from "./Nota.js";
var controlador=new Controlador();
window.onload=function(){
    document.getElementById("nuevaNota").addEventListener("click", ()=>{
        controlador.nuevaNota("normal", "Doble click me", "Doble click me");
    })
    document.getElementById("nuevoToDo").addEventListener("click", ()=>{
        controlador.nuevaNota("toDoList","Doble click me");
    });
    setInterval(haceCuanto, 1000);   
}
function haceCuanto(){
    controlador.arrayNotas.forEach((nota)=>{
        let fecha = new Date(nota.fecha);
        let tiempoActual= new Date(); 
        let resta = tiempoActual.getTime() - fecha.getTime();
        nota.haceCuanto="Hace "+(Math.round( resta/60000))+" min";
        controlador.vista.actualizarHaceCuanto(nota);
    });
}