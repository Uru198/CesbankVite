// controllers/transaction.controller.js
const Transaction = require('../models/transaccion.model');

module.exports.createDeposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id; // El ID del usuario que ha iniciado sesión

    // Puedes realizar validaciones adicionales aquí si es necesario

    const deposit = new Transaction({
      type: 'deposit',
      amount,
      userId,
    });

    await deposit.save();

    // Actualiza el saldo del usuario en su cuenta
    // Debes implementar una lógica adicional aquí para actualizar el saldo en el modelo de usuario

    res.status(201).json({ message: 'Depósito exitoso' });
  } catch (error) {
    console.error('Error al realizar el depósito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
