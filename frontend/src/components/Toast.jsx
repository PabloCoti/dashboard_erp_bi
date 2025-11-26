import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  const cls =
    message.type === "success"
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";
  return (
    <div
      className={`fixed bottom-6 right-6 p-3 rounded shadow ${cls}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="text-sm">{message.text}</div>
        <button
          aria-label="Cerrar"
          onClick={onClose}
          className="ml-2 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
      </div>
    </div>
  );
}
