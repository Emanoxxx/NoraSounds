const url = 'http://emanoxxx.com:';
const axios = require('axios');
var $ = jQuery = require('jquery');
const ConsultasClass= require(__dirname+'/src/js/Consultas.js');

const consultas = new ConsultasClass(url);
// Recuperar ventana enfocada 

$("#etiquetas").focusout(function(){
    document.getElementById("etiquetas").classList.remove("incorrecto");
  });

$("#Borrar-Sound-Button").hover(function(){
    //on-Borrar
    if (!document.getElementById("sonido-folio").classList.contains("on-Borrar")) {
        document.getElementById("sonido-folio").classList.add("on-Borrar");
    }
})
$("#Borrar-Sound-Button").mouseleave(function(){
    document.getElementById("sonido-folio").classList.remove("on-Borrar");
  });
$("#Borrar-Sound-Button").on("click",function(){
    console.log("Borrando");
    borrarSonidoAlert(document.getElementById("sonido-h2-title").innerHTML);
    
  });
$("#search-form").on("submit",function(event){
    event.preventDefault();
    buscar('busqueda');
 });
$("#search-form").on("keyup",function(event){
    event.preventDefault();
    buscar('busqueda');
});
$("#files-upload").on("submit",function(event){
    event.preventDefault();
    sendAudio();
 });
 $("#etiquetas-form").on("submit",function(event){
    event.preventDefault();
    verifyEtiquetas();
 });
 
buscar('busqueda');
const { ipcRenderer } = require("electron");
async function sendAudio() {
    if(document.getElementById("sound-data").files.length==0){
        mandarAlerta("Error","","No ha seleccionado ningun archivo", false);
        return;
    }
    var filelist =(document.getElementById("sound-data").files);
    let SoundData = new FormData();
    var nombre=document.getElementById("sonido-h2-title").innerHTML;
    for (i=0; i<filelist.length; i++) {
        SoundData.append("audio"+ i, filelist[i]);
    }
    SoundData.append("nombre", nombre);
    await axios.post(url+"8080/AddSound",SoundData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    //Respuesta
    .then(function(response){
        var respuestas=response.data;
        var cadena= [];
        respuestas.forEach(respuesta => {
            if(respuesta.Resultado==="Error"){
                cadena.push("Hubo un error con el archivo:"+respuesta.archivo.url);
            }
        });
        if(!cadena.length==0){
            mandarAlerta("Error","",cadena, true);
        }
        llenarUrls(nombre);
    })
    //Caso de error
    .catch(function(err) {
        alert("Error de Conexion");
      });
}
function mandarAlerta(tipo,titulo,contenido, eslista){
    var modal = document.getElementById("modal");
    modal.innerHTML='<div class="sombra" onclick="ocultar()"></div>';
    var articleAlert = document.createElement("article");
        articleAlert.classList.add("sound");
        articleAlert.classList.add("alerta");
    var hgroupAlert = document.createElement("hgroup");
        hgroupAlert.classList.add("alert-title");
        hgroupAlert.innerHTML="<h2 >"+tipo+": "+titulo+"</h2>";
    articleAlert.appendChild(hgroupAlert);
    if(eslista){
        var ulErrors = document.createElement("ul");
            ulErrors.classList.add("error-list");
            contenido.forEach(element => {
                var lielement = document.createElement("li");
                lielement.innerHTML="<p>"+element+"</p>";
                ulErrors.appendChild(lielement);
            });
        articleAlert.appendChild(ulErrors);
    }else{
        var divContent = document.createElement("div");
            divContent.classList.add("error-list");
            divContent.innerHTML="<p style='height: -webkit-fill-available;display: flex;justify-content: center;align-items: center;font-size: large;margin: 0;'>"+contenido+"</p>"
        articleAlert.appendChild(divContent);
    }
    modal.appendChild(articleAlert);
    mostrar();
}
function borrarAlert(sonido,etiqueta,isEtiqueta) {
    var contenido = "¿Seguro que quieres eliminar el Archivo <b>"+etiqueta+"</b>?";
    if (isEtiqueta) {
        contenido = "¿Seguro que quieres eliminar la Etiqueta <b>"+etiqueta+"</b>?";
    }
    var modal = document.getElementById("modal");
    modal.innerHTML='<div class="sombra" onclick="ocultar()"></div>';
    var articleAlert = document.createElement("article");
        articleAlert.classList.add("sound");
        articleAlert.classList.add("alerta");
    var hgroupAlert = document.createElement("hgroup");
        hgroupAlert.classList.add("alert-title");
        hgroupAlert.innerHTML="<h2 >Sonido: "+sonido+"</h2>";
    articleAlert.appendChild(hgroupAlert);
    //
    var divButtons= document.createElement("div");
        divButtons.classList.add("div-buttons");
    var divContent = document.createElement("div");
        divContent.classList.add("content-borrar");
        divContent.innerHTML="<p>"+contenido+"</p>"
    articleAlert.appendChild(divContent);
    var buttonBorrar = document.createElement("button");
        buttonBorrar.classList.add("borrar-Btn");
        buttonBorrar.innerHTML="Borrar";
        if(isEtiqueta){
            buttonBorrar.setAttribute("onclick", "borrarEtiqueta('"+sonido+"','"+etiqueta+"');");
        }else{
            buttonBorrar.setAttribute("onclick", "borrarUrl('"+sonido+"','"+etiqueta+"');");
        }
    
    var buttonCancelar = document.createElement("button");
        buttonCancelar.classList.add("cancelar-Btn");
        buttonCancelar.innerHTML="Cancelar";
        buttonCancelar.setAttribute("onclick", "ocultar();");
    divButtons.appendChild(buttonCancelar);
    divButtons.appendChild(buttonBorrar);
    //
    articleAlert.appendChild(divButtons);
    modal.appendChild(articleAlert);
    mostrar();
}
function closeFrame() {
    ipcRenderer.send("CerrarAplicacion");
}
function minimizeFrame(){
    ipcRenderer.send("MinimizarAplicacion");
}

async function buscar(id) {
    try {
        var value= document.getElementById(id).value;
        var resultado= await consultas.search(value).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
        var opciones= document.getElementById("opciones-sidebar");
        opciones.innerHTML="";
        resultado.data.Data.forEach(element => {
            var liOpcion = document.createElement("li");
            liOpcion.classList.add("sidebar-opcion");
                var aOpcion = document.createElement("a");
                aOpcion.classList.add("sidebar-link");
                aOpcion.innerHTML = element.nombre;
                aOpcion.setAttribute("onclick", "mostrarSonido('"+element.nombre+"')");
            liOpcion.appendChild(aOpcion);
            opciones.appendChild(liOpcion);
        });
    } catch (error) {
        
    }
    
    
}
async function mostrarSonido(sonido){
    var card=document.getElementById("sonido-folio");
    if(!card.classList.contains("inicio")){
        card.classList.add("inicio");
        card.classList.add("cambio-Sound");
    }
    var resultado= await consultas.getSonidosbyNombre(sonido).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
    if(resultado.data.Resultado==="Succes"){
        var nombre = resultado.data.Data[0].nombre;
        document.getElementById("sonido-h2-title").innerHTML=nombre;
        await llenarEtiquetas(nombre);
        await llenarUrls(nombre);
        if(card.classList.contains("inicio")){
            card.classList.remove("inicio");
            card.classList.remove("cambio-Sound");
        }
    }else{
        alert(resultado.data.Message);
    }
}
async function llenarEtiquetas(nombre){
    var resultEtiquetas =await consultas.getEtiquetas(nombre);
    if(resultEtiquetas.data.Resultado==="Succes"){
        //Llenado de etiquetas para
        var etiquetas= document.getElementById("etiquetas-Div");
        etiquetas.innerHTML="";
        resultEtiquetas.data.Data.forEach(element => {
            var spanEtiqueta = document.createElement("span");
            spanEtiqueta.classList.add("etiqueta-Sonido");
            spanEtiqueta.setAttribute("id", "Etiqueta-"+element.sonido+"-"+element.etiqueta);
            spanEtiqueta.setAttribute("onclick", "borrarAlert('"+element.sonido+"','"+element.etiqueta+"',true);");
            spanEtiqueta.innerHTML=element.etiqueta;
            etiquetas.appendChild(spanEtiqueta);
        });
    }else{
        alert(resultEtiquetas.data.Message);
    }
}
async function llenarUrls(nombre){
    var resultUrl =await consultas.getUrls(nombre);
        if(resultUrl.data.Resultado==="Succes"){
            //Llenado de url para
            var url= document.getElementById("url-Div");
            url.innerHTML="";
            resultUrl.data.Data.forEach(element => {
                var spanUrl = document.createElement("span");
                spanUrl.classList.add("url-Sonido");
                spanUrl.setAttribute("id", "url-"+element.sonido+"-"+element.url);
                spanUrl.setAttribute("onclick", "borrarAlert('"+element.sonido+"','"+element.url+"',false);");
                spanUrl.innerHTML=element.url;
                url.appendChild(spanUrl);
            });
        }else{
            alert(resultUrl.data.Message);
        }
}
async function verifyEtiquetas(){
    document.getElementById("etiquetas").classList.remove("incorrecto");
    var valor= document.getElementById("etiquetas").value;
    var nombre=document.getElementById("sonido-h2-title").innerHTML;
    if((valor.length>3 || valor.length<31)&& valor.length!=0){
        var result =await consultas.insertEtiqueta({"sonido":nombre,"etiqueta":valor}).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
        if(result.data.Resultado==="Error"){
            document.getElementById("etiquetas").classList.add("incorrecto");
            shake(document.getElementById("etiquetas"));
        }else{
            document.getElementById("etiquetas").classList.remove("incorrecto");
            document.getElementById("etiquetas").value="";
            document.getElementById("etiquetas").innerHTML="";
            await llenarEtiquetas(nombre);
        }
    }else{
        document.getElementById("etiquetas").classList.add("incorrecto");
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
    modal.innerHTML='<div class="sombra" onclick="ocultar()"></div>';
    if (!modal.classList.contains("non-visible")) {
        modal.classList.add("non-visible");
    }
}
async function borrarEtiqueta(sonido,etiqueta) {
    ocultar();
    var resultado= await consultas.deleteEtiqueta(sonido,etiqueta).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
    if (resultado.data.Resultado==="Error") {
        mandarAlerta("Error","","No se ha podido borrar la etiqueta: <b>"+etiqueta+"</b>", false);
    }else{
        await llenarEtiquetas(sonido);
    }
}
async function borrarUrl(sonido,url) {
    ocultar();
    var resultado= await consultas.deleteUrl(sonido,url).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
    console.log(resultado);
    if (resultado.data.Resultado==="Error") {
        mandarAlerta("Error","","No se ha podido borrar el Archivo: <b>"+etiqueta+"</b>", false);
    }else{
        await llenarUrls(sonido);
    }

}
async function verificarSonido(){
    var value =document.getElementById("input-new-sound").value;
    if((value.length>3 || value.length<51)&& value.length!=0){
        var resultado= await consultas.insertSonido(value).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
        if (resultado.data.Resultado==="Error") {
            if(!document.getElementById("input-new-sound").classList.contains("incorrecto-sound")){
                document.getElementById("input-new-sound").classList.add("incorrecto-sound");
            }
            shake(document.getElementById("input-new-sound"));
            //mandarAlerta("Error","","No se ha podido agregar el Sonido: <b>"+value+"</b>", false);
        }else{
            if(document.getElementById("input-new-sound").classList.contains("incorrecto-sound")){
                document.getElementById("input-new-sound").classList.remove("incorrecto-sound");
            }
            ocultar();
            buscar('busqueda');
            mostrarSonido(value);
        }
    }
    console.log(value);
}
function DesplegarAgregarSonido() {
    var modal = document.getElementById("modal");
    modal.innerHTML='<div class="sombra" onclick="ocultar()"></div>';
    var articleNewSound = document.createElement("div");
        articleNewSound.classList.add("sound");
        articleNewSound.setAttribute("id", "form-add-sound");
        articleNewSound.classList.add("new-Sound");
        articleNewSound.addEventListener("submit", function(event) {
              event.preventDefault();
          });
    var hgroupAlert = document.createElement("hgroup");
        hgroupAlert.classList.add("alert-title");
        hgroupAlert.innerHTML="<h2 >Agrega un nuevo Sonido</h2>";
    articleNewSound.appendChild(hgroupAlert);
    //
    var divButtons= document.createElement("div");
        divButtons.classList.add("add-Sound-buttons");
        divButtons.classList.add("div-buttons");
    var divContent = document.createElement("div");
        divContent.classList.add("content-add-Sound");
    var input = document.createElement("input");  
        input.setAttribute("type", "text");
        input.setAttribute("name","input-new-sound");
        input.setAttribute("id","input-new-sound");
        input.setAttribute("title","Maximo de 50 letras");
        input.setAttribute("pattern",".{3,50}");
        input.setAttribute("placeholder","Sonido...");
        input.classList.add("add-Etiqueta");
        input.classList.add("add-Sound");
        input.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
              // Cancel the default action, if needed
              event.preventDefault();
              verificarSonido();
            }
          });
        divContent.appendChild(input);
    articleNewSound.appendChild(divContent);
    //
    var buttonAdd = document.createElement("button");
        buttonAdd.classList.add("agregar-Btn");
        buttonAdd.innerHTML="Agregar";
        buttonAdd.setAttribute("onclick", "verificarSonido();");
    var buttonCancelar = document.createElement("button");
        buttonCancelar.classList.add("cancelar-Btn");
        buttonCancelar.innerHTML="Cancelar";
        buttonCancelar.setAttribute("onclick", "ocultar();");
    divButtons.appendChild(buttonCancelar);
    divButtons.appendChild(buttonAdd);
    //
    articleNewSound.appendChild(divButtons);
    modal.appendChild(articleNewSound);
    mostrar();
}
async function shake(element) {
    element.classList.add("cambio-Sound");
    await sleep(1000);
    element.classList.remove("cambio-Sound");
}
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
function borrarSonidoAlert(sonido) {
    var contenido = "¿Seguro que quieres eliminar el Sonido <b>"+sonido+"</b>?";
    var modal = document.getElementById("modal");
    modal.innerHTML='<div class="sombra" onclick="ocultar()"></div>';
    var articleAlert = document.createElement("article");
        articleAlert.classList.add("sound");
        articleAlert.classList.add("alerta");
    var hgroupAlert = document.createElement("hgroup");
        hgroupAlert.classList.add("alert-title");
        hgroupAlert.innerHTML="<h2 >Sonido: "+sonido+"</h2>";
    articleAlert.appendChild(hgroupAlert);
    //
    var divButtons= document.createElement("div");
        divButtons.classList.add("div-buttons");
    var divContent = document.createElement("div");
        divContent.classList.add("content-borrar");
        divContent.innerHTML="<p>"+contenido+"</p>"
    articleAlert.appendChild(divContent);
    var buttonBorrar = document.createElement("button");
        buttonBorrar.classList.add("borrar-Btn");
        buttonBorrar.innerHTML="Borrar";
        buttonBorrar.setAttribute("onclick", "borrarSonidoAll('"+sonido+"');");
    var buttonCancelar = document.createElement("button");
        buttonCancelar.classList.add("cancelar-Btn");
        buttonCancelar.innerHTML="Cancelar";
        buttonCancelar.setAttribute("onclick", "ocultar();");
    divButtons.appendChild(buttonCancelar);
    divButtons.appendChild(buttonBorrar);
    //
    articleAlert.appendChild(divButtons);
    modal.appendChild(articleAlert);
    mostrar();
}
async function borrarSonidoAll(sonido){
    ocultar();
    var resultado= await consultas.deleteSonido(sonido).catch(function(error){mandarAlerta("Error","","Error de conexion", false);});
    if (resultado.data.Resultado==="Error") {
        mandarAlerta("Error","","No se ha podido borrar la etiqueta: <b>"+etiqueta+"</b>", false);
    }else{
        buscar('busqueda');
        document.getElementById("sonido-folio").classList.add("inicio");
        shake(document.getElementById("sonido-folio"));
    }
    
}