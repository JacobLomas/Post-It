//Modelo
export class Nota{
    constructor(vista="normal" ,titulo="Titulo", descripcion="" ){
        this.titulo=titulo;
        this.descripcion=descripcion;
        var marcaTiempo=new Date()
        this.fecha=marcaTiempo.toDateString()+" "+marcaTiempo.toLocaleTimeString();
        this.id=uuid.v4();/* Libreria para generar identificadores unicos */
        this.vista=vista;
        this.haceCuanto="Hace 0 minutos";
    }
}
//Vista
export class NotaVista{
    constructor( controlador, div){
        this.controlador=controlador;
        this.divListaNotas=div;
        this.divListaNotas.className="divListaNotas";
        document.body.appendChild(this.divListaNotas);
    }
    initDiv(id){
        let divNota=document.createElement("div");
        divNota.id=id;
        divNota.className="nota";
        return divNota;
    }
    initTitulo(tit){
        let titulo=document.createElement("h1");
        titulo.innerText=tit;
        titulo.contentEditable="true";
        titulo.addEventListener("focusout", (e)=>{
                this.controlador.actualizarTitulo(titulo.parentNode.id,titulo.innerText);
        });
        return titulo;
    }
    initFecha(fecha){
        let date=document.createElement("h4");
        date.innerText=fecha;
        return date;
    }
    initHaceCuanto(fecha){
        let haceCuanto=document.createElement("h6");
        haceCuanto.innerText=fecha;
        return haceCuanto;
    }
    initDivBotones(){
        return document.createElement("div");
    }
    initBotonBorrar(){
        let btnBorrar=document.createElement("button");
        btnBorrar.innerText="Borrar";
        btnBorrar.className=".borrar";
        btnBorrar.addEventListener("click", (e)=>{
            this.controlador.eliminarNota(parseInt(e.target.parentNode.parentNode.id));
            this.eliminarNotaVista(e.target.parentNode.parentNode.id);
        });
        return btnBorrar;
    }
    initColorInput(){
        let color=document.createElement("input");
        color.type="color";
        color.value="#fbf97a";
        color.addEventListener("change", (e)=>{
            if(e.target.parentNode.parentNode.className=="nota estiloMolon"){
                e.target.parentNode.parentNode.style.backgroundColor=e.target.value+"a4";
                e.target.parentNode.parentNode.style.boxShadow="10px 15px 30px "+e.target.value+"a4";
            }else
                e.target.parentNode.parentNode.style.backgroundColor=e.target.value
        });
        return color;
    }
    initDivDrag(){
        let divDrag=document.createElement("div");
        divDrag.style.cssText="padding: 20px;  cursor: move; background-color: #2196F3; color: #fff;";
        divDrag.className="nota-header";
        return divDrag;
    }
    initDescripcion(des){
        let descripcion=document.createElement("p");
        descripcion.innerText=des;
        descripcion.contentEditable="true";
        descripcion.addEventListener("focusout", (e)=>{
                descripcion.contentEditable="false";
                this.controlador.actualizarDescripcion(descripcion.parentNode.id,descripcion.innerText);
            
        });
        return descripcion;
    }

    maquetarNota(tit, date, haceCuant, id, des){
        let divNota=this.initDiv(id.toString());
        let titulo=this.initTitulo(tit);
        let fecha=this.initFecha(date);
        let haceCuanto=this.initHaceCuanto(haceCuant);
        let divBotones=this.initDivBotones();
        let btnBorrar=this.initBotonBorrar();
        let color=this.initColorInput();
        divBotones.appendChild(color);
        divBotones.appendChild(btnBorrar);
        divNota.appendChild(titulo);

        divNota.appendChild(fecha);
        divNota.appendChild(haceCuanto);
        divNota.appendChild(divBotones);
        let divDrag=this.initDivDrag();
        divNota.prepend(divDrag);
        this.divListaNotas.appendChild(divNota);
        let descripcion=this.initDescripcion(des)
        divNota.insertBefore(descripcion, fecha);

    };


    eliminarNotaVista(id){
        let divNotas=this.divListaNotas.getElementsByClassName("nota");
        divNotas= Array.from(divNotas);
        divNotas.forEach((divNota)=>{
            if(divNota.id==id)
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

class NotaVistaLista extends NotaVista{
    constructor(controlador, div=document.createElement("div")){
        super(controlador, div);
    }
    initDiv(id){
        let div=super.initDiv(id);
        div.classList="nota estiloMolon";
        return div;
    }
    initColorInput(){
        let color=super.initColorInput()
        color.value="#77b99d";
        return color;
    }
    initOl(){
        return document.createElement("ol");
    }
    initBotonAñadir(){
        let btn =document.createElement("button");
        btn.innerText="+";
        btn.addEventListener("click", (e)=>{
            let li = document.createElement("li");
            li.innerText="Clic me (else dont save)";
            let ol=e.target.parentNode.querySelector("ol");
            ol.appendChild(li);
            li.contentEditable="true";
            li.addEventListener("focusout", (e)=>{
                let liS = Array.from(e.target.parentNode.getElementsByTagName("li"));
                let textoDescripcion="";
                liS.forEach((li)=>{
                    textoDescripcion+=li.innerText+";";
                });
                this.controlador.actualizarDescripcion(e.target.parentNode.parentNode.id, textoDescripcion);
            })
        })
        return btn;
    }
    initLi(element){
        let li = document.createElement("li");
        li.innerText=element;
        li.contentEditable="true";
        li.addEventListener("focusout", (e)=>{
            let liS = Array.from(e.target.parentNode.getElementsByTagName("li"));
                let textoDescripcion="";
                liS.forEach((li)=>{
                    textoDescripcion+=li.innerText+";";
                });
                this.controlador.actualizarDescripcion(e.target.parentNode.parentNode.id, textoDescripcion);

        })
        return li;

    }
    maquetarNota(tit, date, haceCuant, id, des){
        let divNota=this.initDiv(id.toString());
        let titulo=super.initTitulo(tit);
        let fecha=super.initFecha(date);
        let haceCuanto=super.initHaceCuanto(haceCuant);
        let divBotones=super.initDivBotones();
        let btnBorrar=super.initBotonBorrar();
        let color=this.initColorInput();
        let divDrag=this.initDivDrag();
        divBotones.appendChild(color);
        divBotones.appendChild(btnBorrar);
        divNota.appendChild(titulo);
        divNota.appendChild(fecha);
        divNota.appendChild(haceCuanto);
        divNota.appendChild(divBotones);
        divNota.prepend(divDrag);
        this.divListaNotas.appendChild(divNota);

        /* Formateo el array, separandolo por ; esto me servira para sacar los elementos de la lista */
        var arrayLista;
        if(des!=""){
            arrayLista=des.split(";");
            arrayLista.pop();
        }
        else
            arrayLista=des;
        


        /* Una vez formateado, se generan los li correspondientes y se addieren al ol */
        let ol=this.initOl();
        try{
            if(!arrayLista.length<=0){
            arrayLista.forEach(element => {
                let li=this.initLi(element);
                ol.appendChild(li);
            });
            }
        }catch{}


        let btnAddLi=this.initBotonAñadir();
        divNota.insertBefore(btnAddLi, fecha);
        divNota.insertBefore(ol, btnAddLi);
    };

}


//Controlador
export class Controlador{
    constructor(div=document.createElement("div")){
        this.arrayNotas=[];
        this.vista=new NotaVista(this, div);
        this.vistaLista=new NotaVistaLista(this, div);
        this.recogerLocalSorage();
        window.addEventListener("mousemove", (e)=>{
            try{
                if (imagenEnMovimiento.arrastrando) {
                    imagenEnMovimiento.style.left = (e.pageX - 50) + "px";
                    imagenEnMovimiento.style.top = (e.pageY - 40) + "px";
                }
            }catch{};
        } );        
    };


    recogerLocalSorage(){
        if(localStorage.getItem("notas")){
            this.arrayNotas=JSON.parse(localStorage.getItem("notas"));
            this.arrayNotas.forEach((nota)=>{
                if(nota.vista=="normal")
                    this.vista.maquetarNota(nota.titulo, nota.fecha, nota.haceCuant, nota.id, nota.descripcion);
                if(nota.vista=="toDoList")
                    this.vistaLista.maquetarNota(nota.titulo, nota.fecha, nota.haceCuant, nota.id, nota.descripcion);

            })
            this.moverNotas();
        }

    }

    nuevaNota(vista="normal",titulo="Titulo", descripcion ){
        var nota = new Nota(vista, titulo, descripcion);
        this.arrayNotas.push(nota);
        localStorage.setItem("notas", JSON.stringify(this.arrayNotas));
        if(vista=="normal")
            this.vista.maquetarNota(nota.titulo, nota.fecha, nota.haceCuant, nota.id, nota.descripcion);
        if(vista=="toDoList")
            this.vistaLista.maquetarNota(nota.titulo, nota.fecha, nota.haceCuant, nota.id, nota.descripcion);

        //Recogo los elementos de la maquetacion y añado los eventos a dichos botones 
        this.quitarEventListeners();
        this.moverNotas();
        return nota;
        
    };

    eliminarNota(id){
        this.arrayNotas.forEach((nota,index)=>{
            if(nota.id==id){
                this.arrayNotas.splice(index, 1);
                this.actualizarLocalStorage();
                return true;
            }else
                return false;
        });
    };

    actualizarTitulo(id,titulo){
            this.arrayNotas.forEach((nota)=>{
                if(nota.id=id)
                    nota.titulo=titulo;
            })
            this.actualizarLocalStorage();
    }

    actualizarDescripcion(id, descripcion){
        this.arrayNotas.forEach((nota)=>{
            if(nota.id=id)
                nota.descripcion=descripcion; 
        })
        this.actualizarLocalStorage();
    }

    actualizarLocalStorage(){
        localStorage.setItem("notas", JSON.stringify(this.arrayNotas));
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
var imagenEnMovimiento;
function target(e=window.event){
    var e=e;
    e.target.parentNode.arrastrando = !e.target.parentNode.arrastrando;    
    e.target.parentNode.style.position="absolute";
    imagenEnMovimiento = e.target.parentNode;
 }
