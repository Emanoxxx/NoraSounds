// Obtenga el servicio mysql
const mysql = require('mysql');
const noraDBCredentials = require('../../NoraDB.json');
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection({
    host     : noraDBCredentials.host,
    user     : noraDBCredentials.user,
    password : noraDBCredentials.password,
    database : noraDBCredentials.database
});
const pool = mysql.createPool({
    host     : noraDBCredentials.host,
    user     : noraDBCredentials.user,
    password : noraDBCredentials.password,
    database : noraDBCredentials.database
});
function connectDB(){
    connection.connect(function(err) {
        // en caso de error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
            return false;
        }
    });
    return true;
}

function query(sql,values){
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err,connection){
            if (err) {
                reject({"Resultado":"Error","Message":"Error de conexion","Code":"DB-ERROR-01"});
            }else{
                connection.query(sql, values,(err, rows)=>{
                    if (err) {
                        reject({"Resultado":"Error","Message":"Error de consulta","Code":"DB-ERROR-02"});
                    }else{
                        resolve({"Resultado":"Succes","Message":"Consulta exitosa","Data":rows});
                    }
                    connection.release();
                })
            }
        })
    })
}
//Tabla sonido
const getSonidos = async () => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from Sonido';
    resultado=await query($query);
    return resultado;
};
const getSearch = async (search) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from Sonido where nombre like ' + connection.escape("%"+search+"%");
    resultado=await query($query);
    return resultado;
};
const createSonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'insert into Sonido values ('+connection.escape(sonido)+','+connection.escape("/"+sonido+"/").toLowerCase()+')';
    console.log($query);
    resultado=await query($query);
    return resultado;
};
const getSonidoByName = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from Sonido where nombre = '+connection.escape(sonido);
    resultado=await query($query);
    return resultado;
}
const deleteSonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'Delete * from Sonido where nombre = '+connection.escape(sonido);
    resultado=await query($query);
    return resultado;
};
const updateSonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'UPDATE Sonido set nombre='+connection.escape(sonido.new)+' where nombre = '+connection.escape(sonido.old);
    resultado=await query($query);
    return resultado;
}
//Tabla etiquetas
const createEtiqueta = async(Etiqueta) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'insert into EtiquetaSonido values ('+connection.escape(Etiqueta.sonido)+','+connection.escape(Etiqueta.etiqueta)+')';
    console.log($query);
    resultado=await query($query);
    return resultado;
};
const getEtiquetasBySonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from EtiquetaSonido where sonido = '+connection.escape(sonido);
    resultado=await query($query);
    return resultado;
}
const deleteEtiqueta= async(sonido,etiqueta) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'Delete * from EtiquetaSonido where nombre = '+connection.escape(etiqueta)+' and sonido = '+connection.escape(sonido);
    resultado=await query($query);
    return resultado;
};
//Tabla Url
const createUrl = async(url) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'insert into UrlSonido values ('+connection.escape(url.sonido)+','+connection.escape(url.url)+')';
    console.log($query);
    resultado=await query($query);
    return resultado;
};
const getUrlsBySonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from UrlSonido where sonido = '+connection.escape(sonido);
    resultado=await query($query);
    return resultado;
}
const deleteUrl = async(sonido,url) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'Delete * from UrlSonido where nombre = '+connection.escape(url)+' and sonido = '+connection.escape(sonido);
    resultado=await query($query);
    return resultado;
};
//Tabla sonido
exports.getSearch=getSearch;
exports.getSonidoByName=getSonidoByName;
exports.getSonidos=getSonidos;
exports.createSonido=createSonido;
exports.deleteSonido=deleteSonido;
exports.updateSonido=updateSonido;
//Tabla URL
exports.createUrl=createUrl;
exports.getUrlsBySonido=getUrlsBySonido;
exports.deleteUrl=deleteUrl;
//Tabla Etiquetas
exports.createEtiqueta=createEtiqueta;
exports.getEtiquetasBySonido=getEtiquetasBySonido;
exports.deleteEtiqueta=deleteEtiqueta;


