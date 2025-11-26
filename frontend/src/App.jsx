import React, { useState, useEffect } from "react";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [tab, setTab] = useState("transactions");
  function AnimatedPanel({ children, dep }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }, [dep]);

    return (
      <div
        style={{
          transition: "opacity 220ms ease, transform 220ms ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <h1 className="text-xl font-semibold">Dashboard ERP BI</h1>
        </div>
      </header>
      <nav className="max-w-4xl mx-auto mt-4 px-6 flex gap-4 flex justify-center">
        <button
          onClick={() => setTab("transactions")}
          className={`px-3 py-1 rounded ${
            tab === "transactions" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Transacciones
        </button>
        <button
          onClick={() => setTab("dashboard")}
          className={`px-3 py-1 rounded ${
            tab === "dashboard" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Dashboard
        </button>
      </nav>
      <main className="max-w-4xl mx-auto mt-6 px-6">
        <AnimatedPanel dep={tab}>
          {tab === "transactions" ? <Transactions /> : <Dashboard />}
        </AnimatedPanel>
      </main>
    </div>
  );
}
