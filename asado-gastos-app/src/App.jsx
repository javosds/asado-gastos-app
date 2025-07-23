import React, { useState } from "react";

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addParticipant = () => {
    if (name && amount) {
      setParticipants([...participants, { name, amount: parseFloat(amount) }]);
      setName("");
      setAmount("");
    }
  };

  const calculateSettlements = () => {
    const total = participants.reduce((sum, p) => sum + p.amount, 0);
    const average = total / participants.length;
    const balances = participants.map(p => ({
      name: p.name,
      balance: parseFloat((p.amount - average).toFixed(2))
    }));

    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);

    const transactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amt = Math.min(-debtor.balance, creditor.balance);

      transactions.push({ from: debtor.name, to: creditor.name, amount: amt.toFixed(2) });

      debtor.balance += amt;
      creditor.balance -= amt;

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j++;
    }

    return transactions;
  };

  const transactions = participants.length ? calculateSettlements() : [];

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Divisor de gastos de asado</h1>
      <div>
        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Gasto"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={addParticipant}>Agregar</button>
      </div>
      <ul>
        {participants.map((p, i) => (
          <li key={i}>
            {p.name} gastó $ {p.amount.toFixed(2)}
          </li>
        ))}
      </ul>
      <h2>Transferencias sugeridas</h2>
      {transactions.length === 0 && <p>Todos están saldados o falta data.</p>}
      <ul>
        {transactions.map((t, i) => (
          <li key={i}>
            {t.from} debe enviar $ {t.amount} a {t.to}
          </li>
        ))}
      </ul>
    </div>
  );
}