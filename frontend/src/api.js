/*
Small frontend API helper module.

Centralizing API calls avoids repeating fetch logic across components
and makes it easier to add auth headers, error handling or retries
in a single place later.
*/
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchTransactions() {
  const res = await fetch(`${API}/transactions`);
  return res.json();
}

export async function postTransaction(payload) {
  const res = await fetch(`${API}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Error");
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${API}/transactions/summary`);
  return res.json();
}

export default { fetchTransactions, postTransaction, fetchSummary };
