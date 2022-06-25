const mongoose = require('mongoose');
//require('dotenv').config()
//console.log(process.env)

// const port = 3400; //el puerto son ventanas que usa windows para comunicar diferentes aplicaciones
const port = process.env.PORT || 3400;

const password = require('./config/config').dbPassword

const URL = `mongodb+srv://facumedina:${password}@cluster0.s5qk3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const URL = `mongodb+srv://neotech:Clav3Clav3@cluster0.lwbyo.mongodb.net/ng?authSource=admin&replicaSet=atlas-m10gyp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;

const app = require('./app')

// //IIFE
async function dbConnect() {
    try { //con try intento hacer todo lo que yo creo que pueda suceder correctamente
        await mongoose.connect(URL)//con esto me conecto a la base de datos.
        console.log(`\x1b[32m Connected to MongoDB \x1b[37m`); //hago un consolelog cuando la coneccion sea satisfactoria. esta line no se va a ejecutar hasta q la conexion no se realice xq demora.
        app.listen(port, () => { //servidor empieza a escuchar cualq peticion q se haga en el puerto 3400
          console.log(`\x1b[36m Servidor escuchando en el puerto ${port} \x1b[37m`);
        });
    } catch (error) { //si algo falla hago el catch
        console.error(`\x1b[31m Error al conectarse a la DB \x1b[37m`, error)
    }  
}//con esta conezion me conecto a la base de datos de mongo y levantando el servidor.
dbConnect()



//dbConnect() para que la funcion se ejecute la tengo que llamar. o encierro todo entre parentesis y abro y cierro al final. () se llama IIFE