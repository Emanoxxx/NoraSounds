const axi = require('axios');
const resultado= null;
module.exports = class Consultas
    {
        constructor(url){
            this.url=url;
        }
        search(valor){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/getSearch",{
                    "search":valor
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        //Selects
        getSonidos(){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/getSonidos").then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        getSonidosbyNombre(nombre){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/getSonidoByName",{
                    "name":nombre
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        getEtiquetas(nombre){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/getEtiquetasBySonido",{
                    "name":nombre
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        getUrls(nombre){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/getUrlsBySonido",{
                    "name":nombre
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        //Inserts
        insertSonido(nombre){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/insertSonido",{
                    "name":nombre
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        insertEtiqueta(EtiquetaJSON){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/inserEtiqueta",{
                    "Etiqueta":EtiquetaJSON
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        //Delets
        deleteSonido(nombre){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/RemoveFolderSonido",{
                    "name":nombre
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        deleteEtiqueta(nombre,etiqueta){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/deleteEtiqueta",{
                    "name":nombre,
                    "etiqueta":etiqueta
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }
        deleteUrl(nombre,url){
            return new Promise((resolve, reject) => {
                axi.post(this.url+"8080/RemoveSound",{
                    "name":nombre,
                    "url":url
                }).then(function(response){resolve(response);}).catch(function(err){reject(err);});
            })
        }

    }