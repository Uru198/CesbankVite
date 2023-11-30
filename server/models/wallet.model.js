const mongoose = require("mongoose");

const EsquemaWallet = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "Nombre obligatorio"],
        minLength: [3, "Nombre debe tener almenos 3 caracteres"]
    },
    monto: {
        type: Number,
        required: [true, "Monto es necesario"],
        minLength: [2, "el valor minimo debe de ser de dos cifras"]
    },
    cedula: {
        type: Number,
        required: [true, "Cedula es necesaria"],
        minLength: [10, "La cedula debe tener 10 digitos"]
    },
    cuenta_ahorros: {
        type: Boolean,
        default: false
    },
    cuenta_corriente: {
        type: Boolean,
        default: false
    },
    tipo_accion: {
        type: String
    }
 
}, {timestamps: true, versionKey: false})

//timestamps crea los campos de createAt y updateAt
//versionKey: false elimina el atributo _v

const Wallet = mongoose.model("wallets", EsquemaWallet);

module.exports = Wallet;