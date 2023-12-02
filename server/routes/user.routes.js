const UserController = require("../controllers/user.controllers")
const WalletController = require("../controllers/wallet.controllers")
const TransferenciaController = require("../controllers/transferencia.controller")
const { authenticate } = require("../config/jwt.config")

module.exports = app => {
    app.get("/api/wallets", authenticate, WalletController.get_all);
    app.get("/api/wallets/:id", authenticate, WalletController.get_wallet);
    app.post("/api/deposito/new", authenticate, WalletController.create_deposito);

    app.get("/api/transferencias", authenticate, TransferenciaController.get_all);
    app.get("/api/transferencia/:id", authenticate, TransferenciaController.get_transferencia);
    app.post("/api/transferencia/new", authenticate, TransferenciaController.create_transferencia);
    
    app.get("/api/usuarios", authenticate, UserController.get_all);
    app.get("/api/usuarios/:id", authenticate, UserController.get_usuarios);
    app.post("/api/register", UserController.register);
    app.post("/api/login", UserController.login);
    app.get("/api/logout", UserController.logout);

}