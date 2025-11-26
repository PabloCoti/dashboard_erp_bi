export function formatAmount(n) {
  if (typeof n !== "number") return n;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
