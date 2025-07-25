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
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif", backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <h1 style={{ color: "#2d2d2d", textAlign: "center" }}>🔥 Divisor de gastos de asado</h1>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Gasto"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ width: "100px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button onClick={addParticipant} style={{ padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Agregar
        </button>
      </div>

      <ul style={{ paddingLeft: "1rem", marginBottom: "1.5rem" }}>
        {participants.map((p, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            <strong>{p.name}</strong> gastó <span style={{ color: "#16a34a" }}>$ {p.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h2 style={{ color: "#444", marginBottom: "0.5rem" }}>💸 Transferencias sugeridas</h2>
      {transactions.length === 0 ? (
        <p style={{ color: "#777" }}>Todos están saldados o falta data.</p>
      ) : (
        <ul style={{ paddingLeft: "1rem" }}>
          {transactions.map((t, i) => (
            <li key={i} style={{ marginBottom: "4px" }}>
              <span style={{ color: "#ef4444" }}>{t.from}</span> debe enviar <strong>$ {t.amount}</strong> a <span style={{ color: "#3b82f6" }}>{t.to}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
