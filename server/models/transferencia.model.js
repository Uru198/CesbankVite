const mongoose = require('mongoose');

const transferenciaSchema = new mongoose.Schema({
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
    },
    numeroTransferencia: {
      type: Number,
      required: [true, "numero de cuenta es necesaria"],
        minLength: [10, "el numero de cuenta debe ser de 10 digitos"]
    },
    banco: {
      type: String
    }
  // Otros campos necesarios para la transacción
}, { timestamps: true, versionKey: false });

const Transferencia = mongoose.model('transferencia', transferenciaSchema);

module.exports = Transferencia;
