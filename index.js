const http = require("http");
const {createReadStream, stat} = require("fs");
const {join} = require("path");

//funcion que recibe una extension y retorna un content type
function tipo(extension){
    if(extension == "html") return "text/html"; //solo en este caso se puede no poder llaves porq retorno una linea de texto
    if(extension == "css") return "text/css";
    if(extension == "js") return "text/javascript";
    if(extension == "json") return "application/javascript";
    if(extension == "jpg") return "image/jpeg";
    if(extension == "png") return "image/png";

    return "text/plain"
}

function servirFichero(respuesta, ruta, tipo, status){

    let fichero = createReadStream(ruta); 
    respuesta.writeHead(status, {"Content-type" : tipo});
    fichero.pipe(respuesta);
    fichero.on("end" , () => respuesta.end());

}

const directorioEstatico = join(__dirname,"publica");

http.createServer((peticion, respuesta) => {

    if(peticion.url == "/"){
        return servirFichero(respuesta, join(directorioEstatico, "index.html"), tipo("html"), 200);
    }
    
    let ruta = join(directorioEstatico, peticion.url);

    stat(ruta, (error, estadisticas) => {
        if(!error && estadisticas.isFile()){
            return servirFichero(respuesta, ruta, tipo(ruta.split(".").pop()), 200);
        }

        servirFichero(respuesta, join(__dirname,"404.html"), tipo("html"), 404);

    });

    /* Stat necesita 2 argumentos, la ruta y un callback --> recibe el posible error y las estadisticas del elemento*/


  

}).listen(4000);


/*

http.createServer((peticion, respuesta) => {
    respuesta.writeHead(418, { "Content-type" : "text/html"});
    fs.readFile("./404.html", (error,contenido) => { 
        respuesta.write(contenido);
        respuesta.end();
    });
}).listen(4000);


*/


/* createServer --> retorna una interface que escucha peticones en el puerto seleccionado. --> Recibe como argumento un CALLBACK 

node--> necesita q el proceso este siempre activo

*/