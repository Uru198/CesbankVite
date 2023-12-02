const Transferencia = require("../models/transferencia.model")

module.exports.get_all = (req, res) => {
  Transferencia.find().sort({nombre: 1})
        .then(transferencia => res.json(transferencia))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
}
//depositos pruebas---

module.exports.create_transferencia = (req, res) => {
  Transferencia.create(req.body)
        .then(transferencia => res.json(transferencia))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
}

module.exports.get_transferencia = (req, res) => {
  Transferencia.findOne({_id: req.params.id})
        .then(transferencia => res.json(transferencia))
        .catch(err => res.json({message: "Hubo un error "+err}));
}
