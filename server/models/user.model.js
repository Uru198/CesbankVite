const mongoose = require('mongoose');
const bcrypt = require("bcrypt") //Importacion de bcrypt

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Nombre es obligatorio."]
    },
    email: {
        type: String,
        required: [true, "E-mail es obligatorio."],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Ingrese un e-mail válido."
        },
        unique: true //Unique no nos va a guardar cuando un email se repite PERO no es un validador
    },
    password: {
        type: String,
        required: [true, "Password es obligatorio."],
        minlength: [8, "Password debe de tener al menos 8 caracteres"]
    },
    cuentaDeAhorros: {
        type: String // Un array de números para almacenar los 10 números aleatorios
    }

}, {timestamps: true, versionKey: false})

//Atributo Temporal
UserSchema.virtual("confirmPassword")
    .get( () => this._confirmPassword)
    .set( value => this._confirmPassword = value);

//Se hace ANTES de validar el esquema de usuario
UserSchema.pre("validate", function(next) {
    if(this.password != this.confirmPassword) {
        this.invalidate("confirmPassword", "Las contraseñas no coinciden");
    }
    next();
});

//Antes de guardar el usuario, encriptamos la contraseña
UserSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;

        // Generar 10 números aleatorios como un string
        this.cuentaDeAhorros = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');

        next();
    } catch (error) {
        next(error);
    }
});

const Usuario = mongoose.model("usuarios", UserSchema);
module.exports = Usuario;