const axios = require('axios');
const { ipcRenderer } = require("electron");
window.onload = reload;
function reload() {
    var card = document.getElementById("load-card");
    if (card.classList.contains("error")) {
        card.classList.remove("error"); 
    }
    if (!document.getElementById("button-load").classList.contains("loader")) {
        document.getElementById("button-load").classList.add("loader"); 
    }
    document.getElementById("button-load").innerHTML='';
    document.getElementById("Message-load").innerHTML="Cargando...";
    axios.get("http://emanoxxx.com:8080/").then(async function(response){
        await sleep(500);
        if (!card.classList.contains("correcto")) {
            card.classList.add("correcto"); 
        }
        document.getElementById("Message-load").innerHTML="Conexion establecida";
        await sleep(1000);
        ipcRenderer.send("LoadMainwindow");
  }).catch(function(err){
    document.getElementById("Message-load").innerHTML="Ocurrio un error en la conexion.";
    if (!card.classList.contains("error")) {
       card.classList.add("error"); 
    }
    if (document.getElementById("button-load").classList.contains("loader")) {
        document.getElementById("button-load").classList.remove("loader"); 
    }
    document.getElementById("button-load").innerHTML='<button name="recarga" type="button" onclick="reload()" >Recarga</button>';

  });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}