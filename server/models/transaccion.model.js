const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdraw'], // Puedes tener tipos como depósito y retiro
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Otros campos necesarios para la transacción
}, { timestamps: true, versionKey: false });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
