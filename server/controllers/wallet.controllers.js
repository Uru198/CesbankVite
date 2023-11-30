const Wallet = require("../models/wallet.model")

module.exports.get_all = (req, res) => {
    Wallet.find().sort({nombre: 1})
        .then(walles => res.json(walles))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
}

module.exports.create_deposito = (req, res) => {
    Wallet.create(req.body)
        .then(walles => res.json(walles))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
}

module.exports.get_wallet = (req, res) => {
    Wallet.findOne({_id: req.params.id})
        .then(wallet => res.json(wallet))
        .catch(err => res.json({message: "Hubo un error "+err}));
}

