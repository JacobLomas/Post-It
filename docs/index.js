import{Controlador} from "./Nota.js";
var controlador=new Controlador();
window.onload=function(){
    document.getElementById("nuevaNota").addEventListener("click", ()=>{
        controlador.nuevaNota("normal", "Click me", "Click me");
    })
    document.getElementById("nuevoToDo").addEventListener("click", ()=>{
        controlador.nuevaNota("toDoList","Click me (List)");
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