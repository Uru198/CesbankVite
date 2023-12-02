const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser')


//Para usar cookies en la aplicación
app.use(cookieParser());


//Para poder usar json y obtener datos de la URL
app.use(express.json(), express.urlencoded({extended: true}));

//Permite acceder de un origen distinto 
app.use(
    cors ({
        origin: "http://127.0.0.1:5173",
        credentials: true
    }),
);

//Pendiente inicializar base de datos
require("./server/config/mongoose.config");

//Pendiente importar las rutas
const misRutas = require("./server/routes/user.routes");
misRutas(app);

app.listen(8000, () => console.log("servidor listo!"));

//Instaladores:
//npm install jsonwebtoken cookie-parser
