const Usuario = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret_key = "Esta es mi llave secreta"; //Debe ser la misma a lo largo de todo nuestro app
const bcrypt = require("bcrypt");

module.exports.register = (req, res) => {
    const user = new Usuario(req.body);
    console.log("Usuario a guardar:", user);
    user.save()
        .then(usuario => {
            console.log("Usuario guardado:", usuario);
            //res.json(usuario);

            //Ponemos un payload -> todo lo que queremos guardar
            const payload = {
                _id: usuario._id
            }

            //Creamos nuestro token
            const myJWT = jwt.sign(payload, secret_key);

            res
                .cookie("usertoken", myJWT, secret_key, {
                    httpOnly: true //Esto significa que la cookie solamente puede ser leída por el servidor
                }).json(usuario);

        })
        .catch(err => {console.error("Error al guardar el usuario:", err); res.status(400).json(err)});
        
}

module.exports.login = (req, res) => {
    Usuario.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.json({ error: true, message: "El correo electrónico es incorrecto." });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(passwordValid => {
                        if (passwordValid) {
                            const payload = {
                                _id: user._id
                            }
                            const myJWT = jwt.sign(payload, secret_key);
                            res
                                .cookie("usertoken", myJWT, secret_key, {
                                    httpOnly: true
                                })
                                .json({ error: false, message: "Inicio de sesión correcto" })

                        } else {
                            res.json({ error: true, message: "La contraseña es incorrecta." });
                        }
                    })
            }
        })
}

module.exports.get_all = (req, res) => {
    Usuario.find()
        .then(usuarios => res.json(usuarios))
        .catch(err => res.json({message: "Hubo un error "+err}));
}

module.exports.get_usuarios = (req, res) => {
    Usuario.findOne({_id: req.params.id})
        .then(usuario => res.json(usuario))
        .catch(err => res.json({message: "Hubo un error "+err}));
}

module.exports.logout = (req, res) => {
    res.clearCookie('usertoken');
    res.json({ message: "Salimos de sesión!" });
}


module.exports.depositar = async (req, res) => {
    try {
      const { id } = req.params;
      const { monto } = req.body;
  
      const user = await Usuario.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      user.cuentaDeAhorros += parseFloat(monto);
      await user.save();
  
      res.json({ message: 'Depósito exitoso', user });
    } catch (error) {
      res.status(500).json({ error: 'Error al realizar el depósito' });
    }
  };


  module.exports.retirar = async (req, res) => {
    try {
      const { id } = req.params;
      const { monto } = req.body;
  
      const user = await Usuario.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      if (parseFloat(monto) > user.cuentaDeAhorros) {
        return res.status(400).json({ error: 'Saldo insuficiente para realizar el retiro' });
      }
  
      user.cuentaDeAhorros -= parseFloat(monto);
      await user.save();
  
      res.json({ message: 'Retiro exitoso', user });
    } catch (error) {
      res.status(500).json({ error: 'Error al realizar el retiro' });
    }
  };

module.exports.transferir = async (req, res) => {
    try {
      const { id } = req.params;
      const { destinatarioId, monto } = req.body;
  
      const remitente = await Usuario.findById(id);
      const destinatario = await Usuario.findById(destinatarioId);
  
      if (!remitente || !destinatario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      if (parseFloat(monto) > remitente.cuentaDeAhorros) {
        return res.status(400).json({ error: 'Saldo insuficiente para realizar la transferencia' });
      }
  
      remitente.cuentaDeAhorros -= parseFloat(monto);
      destinatario.cuentaDeAhorros += parseFloat(monto);
  
      await remitente.save();
      await destinatario.save();
  
      res.json({ message: 'Transferencia exitosa', remitente, destinatario });
    } catch (error) {
      res.status(500).json({ error: 'Error al realizar la transferencia' });
    }
  };

  exports.getHistorial = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Usuario.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Lógica para obtener y devolver el historial del usuario (puede ser una lista en el modelo del usuario).
  
      res.json({ historial: user.historial });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial' });
    }
  };