// ────────────────────────────────────────────────────────────────────────────────
// Utils (you can move these to a separate file like `lib/format.ts`)
const formatCurrency = (v?: number | null) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(v ?? 0));

const formatPercent = (v?: number | null, digits = 2) =>
  `${(((v ?? 0) as number) * 100).toFixed(digits)}%`;

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
  } catch {
    return iso ?? "—";
  }
};

export { formatCurrency, formatDateTime, formatPercent };
