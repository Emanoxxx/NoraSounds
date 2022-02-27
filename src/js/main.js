buscar('busqueda');
var $ = jQuery = require('jquery');
// Recuperar ventana enfocada
$("#search-form").on("submit",function(event){
    event.preventDefault();
    buscar('busqueda');
 });
const { ipcRenderer } = require("electron");

function closeFrame() {
    ipcRenderer.send("CerrarAplicacion");
}
function minimizeFrame(){
    ipcRenderer.send("MinimizarAplicacion");
}

async function buscar(id) {
    var value= document.getElementById(id).value;
    var dao= require("./models/dao");
    var resultado= await dao.getSearch(value);
    var opciones= document.getElementById("opciones-sidebar");
    opciones.innerHTML="";
    resultado.Data.forEach(element => {
        var liOpcion = document.createElement("li");
        liOpcion.classList.add("sidebar-opcion");
            var aOpcion = document.createElement("a");
            aOpcion.classList.add("sidebar-link");
            aOpcion.innerHTML = element.nombre;
            aOpcion.setAttribute("onclick", "mostrarSonido('"+element.nombre+"')");
        liOpcion.appendChild(aOpcion);
        opciones.appendChild(liOpcion);
    });
    
}
async function mostrarSonido(sonido){
    var dao= require("./models/dao");
    var resultado= await dao.getSonidoByName(sonido);
    if(resultado.Resultado==="Succes"){
        var nombre = resultado.Data[0].nombre;
        document.getElementById("sonido-h2-title").innerHTML=nombre;
        var resultEtiquetas =await dao.getEtiquetasBySonido(nombre);
        if(resultEtiquetas.Resultado==="Succes"){
            //Llenado de etiquetas para
            var etiquetas= document.getElementById("etiquetas-Div");
            etiquetas.innerHTML="";
            resultEtiquetas.Data.forEach(element => {
                var spanEtiqueta = document.createElement("span");
                spanEtiqueta.classList.add("etiqueta-Sonido");
                spanEtiqueta.setAttribute("id", "Etiqueta-"+element.sonido+"-"+element.etiqueta);
                spanEtiqueta.innerHTML=element.etiqueta;
                etiquetas.appendChild(spanEtiqueta);
            });
        }else{
            alert(resultEtiquetas.Message);
        }

        var resultUrl =await dao.getUrlsBySonido(nombre);
        if(resultUrl.Resultado==="Succes"){
            //Llenado de url para
            var url= document.getElementById("url-Div");
            url.innerHTML="";
            resultUrl.Data.forEach(element => {
                var spanUrl = document.createElement("span");
                spanUrl.classList.add("url-Sonido");
                spanUrl.setAttribute("id", "url-"+element.sonido+"-"+element.url);
                spanUrl.innerHTML=element.url;
                url.appendChild(spanUrl);
            });
        }else{
            alert(resultUrl.Message);
        }
    }else{
        alert(resultado.Message);
    }
    
}
function mostrar(){
    var modal = document.getElementById("modal");
    if (modal.classList.contains("non-visible")) {
        modal.classList.remove("non-visible");
    }
}
function ocultar(){
    var modal = document.getElementById("modal");
    if (!modal.classList.contains("non-visible")) {
        modal.classList.add("non-visible");
    }
}
