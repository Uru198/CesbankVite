import React, { createContext, useState, useContext } from 'react';

const SaldoContext = createContext();

const SaldoProvider = ({ children }) => {
  const [saldo, setSaldo] = useState(0);

  return (
    <SaldoContext.Provider value={{ saldo, setSaldo }}>
      {children}
    </SaldoContext.Provider>
  );
};

const useSaldo = () => {
  const context = useContext(SaldoContext);
  if (!context) {
    throw new Error('useSaldo debe ser utilizado dentro de un SaldoProvider');
  }
  return context;
};

export { SaldoProvider, useSaldo, SaldoContext };
