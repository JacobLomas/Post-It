//Modelo
export class Nota{
    constructor(vista="normal",titulo="Titulo", descripcion="" ){
        this.titulo=titulo;
        this.descripcion=descripcion;
        var marcaTiempo=new Date()
        this.fecha=marcaTiempo.toDateString()+" "+marcaTiempo.toLocaleTimeString();
        this.id=marcaTiempo.getTime().toString(); //Me sirve como identificador único de cada nota
        this.vista=vista;
        this.haceCuanto="Hace 0 minutos";
    }
}
//Vista
export class NotaVista{
    constructor(div=document.createElement("div")){
        this.divListaNotas=div;
        this.divListaNotas.className="divListaNotas";
        document.body.appendChild(this.divListaNotas);
    }

    maquetarNota(nota, vista="normal"){
        let divNota=document.createElement("div");
        divNota.id=nota.id.toString();
        divNota.className="nota";
        var asigEventos;
        let titulo=document.createElement("h1");
        titulo.innerText=nota.titulo;
        let fecha=document.createElement("h4");
        fecha.innerText=nota.fecha;
        let haceCuanto=document.createElement("h6");
        haceCuanto.innerText=nota.haceCuanto;
        let divBotones=document.createElement("div");
        let btnBorrar=document.createElement("button");
        btnBorrar.innerText="Borrar";
        btnBorrar.className=".borrar";
        let color=document.createElement("input");
        color.type="color";
        color.value="#fbf97a";
        divBotones.appendChild(color);
        divBotones.appendChild(btnBorrar);
        divNota.appendChild(titulo);

        divNota.appendChild(fecha);
        divNota.appendChild(haceCuanto);
        divNota.appendChild(divBotones);
        let divDrag=document.createElement("div");
            divDrag.style.cssText="padding: 20px;  cursor: move; background-color: #2196F3; color: #fff;";
            divDrag.className="nota-header";
        divNota.prepend(divDrag);
        this.divListaNotas.appendChild(divNota);

        if(vista=="normal"){
            let descripcion=document.createElement("p");
            descripcion.innerText=nota.descripcion;
            asigEventos={
                borrar:btnBorrar,
                titulo:titulo,
                descripcion:descripcion,
                divDrag,
                color
            };
            divNota.insertBefore(descripcion, fecha);
        }
        if(vista=="toDoList"){
            divNota.classList="nota estiloMolon";
            color.value="#77b99d";
            var arrayLista;
            if(nota.descripcion!=""){
                arrayLista=nota.descripcion.split(";");
                arrayLista.pop();
            }
            else
                arrayLista=nota.descripcion;
           
            var ol=document.createElement("ol");
            try{
                if(!arrayLista.length<=0){
                arrayLista.forEach(element => {
                    let li=document.createElement("li");
                    li.innerText=element;
                    ol.appendChild(li);
                });
                }
            }catch{}
            let btnAddLi=document.createElement("button");
            btnAddLi.innerText="+";
            divNota.insertBefore(btnAddLi, fecha);

            divNota.insertBefore(ol, btnAddLi);
            asigEventos={
                borrar:btnBorrar,
                titulo:titulo,
                lista:ol,
                divDrag,
                color,
                btnAddLi
            };
        }
        return asigEventos;
    };


    eliminarNotaVista(nota){
        let divNotas=this.divListaNotas.getElementsByClassName("nota");
        divNotas= Array.from(divNotas);
        divNotas.forEach((divNota)=>{
            if(divNota.id==nota.id)
                this.divListaNotas.removeChild(divNota);
        })
    }


    actualizarHaceCuanto(nota){
        var divs=Array.from(document.getElementsByClassName("nota"));
        divs.forEach(div=>{
            if(div.id==nota.id){
                div.querySelector("h6").innerText=nota.haceCuanto;
            }
        })
    }


    crearTextAreaEdicion(texto){
        let textArea=document.createElement("textarea");
        textArea.innerText=texto;
        return textArea;
    }
}



//Controlador
export class Controlador{
    constructor(vista=new NotaVista()){
        this.arrayNotas=[];
        this.vista=vista;
        this.recogerLocalSorage();
        window.addEventListener("mousemove", (e)=>{
            try{
                if (window.imagenEnMovimiento.arrastrando) {
                    window.imagenEnMovimiento.style.left = (e.x - 50) + "px";
                    window.imagenEnMovimiento.style.top = (e.y - 40) + "px";
                }
            }catch{};
        } );        
    };


    recogerLocalSorage(){
        if(localStorage.getItem("notas")){
            this.arrayNotas=JSON.parse(localStorage.getItem("notas"));
            this.arrayNotas.forEach((nota)=>{
                let elementos=this.vista.maquetarNota(nota, nota.vista);
                this.añadirEventListeners(elementos);
            })
        }

    }

    nuevaNota(vista="normal",titulo="Titulo", descripcion ){
        var nota = new Nota(vista,titulo, descripcion);
        this.arrayNotas.push(nota);
        localStorage.setItem("notas", JSON.stringify(this.arrayNotas));
        

        //Recogo los elementos de la maquetacion y añado los eventos a dichos botones
        let elementos=this.vista.maquetarNota(nota, vista);
        this.añadirEventListeners(elementos);
        return nota;
        
    };

    eliminarNota(id){
        this.arrayNotas.forEach((nota,index)=>{
            if(nota.id==id){
                this.arrayNotas.splice(index, 1);
                this.vista.eliminarNotaVista(nota)
                this.actualizarLocalStorage();
                return true;
            }else
                return false;
        });
    };

    actualizarLocalStorage(){
        localStorage.setItem("notas", JSON.stringify(this.arrayNotas));
    }
    añadirEventListeners(elementos){
        //Mover Notas
        //Quito los evento que se esten ejecutando
        this.quitarEventListeners();
        //Vuelvo a añadir los eventListener a todas las notas
        this.moverNotas();

        //Boton borrar
        elementos.borrar.addEventListener("click", (e)=>{
            this.eliminarNota(parseInt(e.target.parentNode.parentNode.id));
        });       

        //Input de cambiar el color;
        elementos.color.addEventListener("change", (e)=>{
            if(e.target.parentNode.parentNode.className=="nota estiloMolon"){
                e.target.parentNode.parentNode.style.backgroundColor=e.target.value+"a4";
                e.target.parentNode.parentNode.style.boxShadow="10px 15px 30px "+e.target.value+"a4";
            }else
                e.target.parentNode.parentNode.style.backgroundColor=e.target.value
        })
        
        //Actualizar el titulo
        elementos.titulo.addEventListener("dblclick", (e)=>{
            let textArea=this.vista.crearTextAreaEdicion(e.target.textContent);
            e.target.style.display="none";
            e.target.parentNode.insertBefore(textArea, e.target.parentNode.getElementsByTagName("p")[0]);
            textArea.focus();
            textArea.addEventListener("focusout", (e)=>{
                let titulo=e.target.parentNode.getElementsByTagName("h1")[0];
                titulo.innerText=e.target.value;
                titulo.style.display="block";
                e.target.style.display="none";


                //Con el id, actualizamos la informacion de la nota que se encuentra en el array de notas
                let id=e.target.parentNode.id;
                this.arrayNotas.forEach((nota)=>{
                    if(nota.id=id)
                        nota.titulo=e.target.value;
                })
                this.actualizarLocalStorage();
                
            })
            
        })
        

        //Actualizar la descripcion
        if(elementos.descripcion){
            elementos.descripcion.addEventListener("dblclick", (e)=>{
                let textArea=this.vista.crearTextAreaEdicion(e.target.textContent);
                e.target.style.display="none";
                e.target.parentNode.insertBefore(textArea, e.target.parentNode.getElementsByTagName("h4")[0]);
                textArea.focus();
                textArea.addEventListener("focusout", (e)=>{
                    let descripcion=e.target.parentNode.getElementsByTagName("p")[0];
                    descripcion.innerText=e.target.value;
                    descripcion.style.display="block";
                    e.target.style.display="none";


                    //Con el id, actualizamos la informacion de la nota que se encuentra en el array de notas
                    let id=e.target.parentNode.id;
                    this.arrayNotas.forEach((nota)=>{
                        if(nota.id=id)
                            nota.descripcion=e.target.value;
                    })
                    this.actualizarLocalStorage();
                })
                
                
            })
        }

        //Actualizar lista
        if(elementos.lista){
            var filasli=Array.from(elementos.lista.getElementsByTagName("li"));
            filasli.forEach((li, index)=>{
                li.addEventListener("dblclick", (e)=>{
                    let textArea=this.vista.crearTextAreaEdicion(e.target.textContent);
                    textArea.style.display="list-item";
                    e.target.style.display="none";
                    if(index==filasli.length-1)
                        e.target.parentNode.insertBefore(textArea, e.target.parentNode.getElementsByTagName("h4")[0]);
                    else
                        e.target.parentNode.insertBefore(textArea, filasli[index]);
                    textArea.focus();
                    textArea.addEventListener("focusout", (e)=>{
                        li.innerText=e.target.value;
                        li.style.display="list-item";
                        e.target.style.display="none";

                        //Actualizar localStorage y la nota
                        let id=e.target.parentNode.parentNode.id;
                        let liS = Array.from(e.target.parentNode.getElementsByTagName("li"));
                        let textoDescripcion="";
                        liS.forEach((li)=>{
                            textoDescripcion+=li.innerText+";";
                        })
                        this.arrayNotas.forEach((nota)=>{
                            if(nota.id==id)
                                nota.descripcion=textoDescripcion;
                        })
                        this.actualizarLocalStorage();
                    });
                })
            })
        }

        //Añadir elementos a la lista
        if(elementos.btnAddLi && elementos.lista){
            var filasli=Array.from(elementos.lista.getElementsByTagName("li"));
            elementos.btnAddLi.addEventListener("click", (e)=>{
                let li = document.createElement("li");
                li.innerText="To-Do";
                let ol=e.target.parentNode.querySelector("ol");
                ol.appendChild(li);/* 
                filasli.push(li); */
                var textArea=this.vista.crearTextAreaEdicion(e.target.textContent);
                li.addEventListener("dblclick", (e)=>{
                    textArea.style.display="list-item";
                    e.target.style.display="none";
                    e.target.parentNode.insertBefore(textArea, e.target.parentNode.getElementsByTagName("h4")[0]);
                    textArea.focus();
                    textArea.addEventListener("focusout", (e)=>{
                        li.innerText=e.target.value;
                        li.style.display="list-item";
                        e.target.style.display="none";
                         
                        
                        //Actualizar localStorage y la nota
                        let id=e.target.parentNode.parentNode.id;
                        let liS = Array.from(e.target.parentNode.getElementsByTagName("li"));
                        let textoDescripcion="";
                        liS.forEach((li)=>{
                            textoDescripcion+=li.innerText+";";
                        })
                        this.arrayNotas.forEach((nota)=>{
                            if(nota.id==id)
                                nota.descripcion=textoDescripcion;
                        })
                        this.actualizarLocalStorage();
                    });
                })
            })
        }
    }

    moverNotas(){
        var divsNotas=document.getElementsByClassName("nota");
        divsNotas=Array.from(divsNotas);
        divsNotas.forEach(divsNota => {
            divsNota.arrastrando=false;
            divsNota.divEnMovimiento=false;
            divsNota.getElementsByClassName("nota-header")[0].addEventListener("mousedown", target);
        });
    }
    quitarEventListeners(){
        var headers = document.getElementsByClassName("nota-header");
        headers=Array.from(headers);
        headers.forEach((div)=>{
            div.removeEventListener("mousedown", target);
        })
    }
}
function target(e=window.event){
    var e=e;
    e.target.parentNode.arrastrando = !e.target.parentNode.arrastrando;    
    e.target.parentNode.style.position="absolute";
    window.imagenEnMovimiento = e.target.parentNode;

 }