import React, { useEffect, useState } from "react";
import API from "../../services/api";

function fmt(n) {
  return Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function FinanceSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/v1/finance")
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error("Finance summary error:", err);
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading summary…</p>;
  if (!summary) return <p className="text-sm text-rose">Failed to load summary.</p>;

  const rows = [
    ["Total income", summary.total_income, "text-emerald-light"],
    ["Total expenses", summary.total_expense, "text-rose"],
    ["Net balance", summary.net_balance, "text-white"],
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-3">Summary</h3>
      <div className="space-y-2.5">
        {rows.map(([label, value, color]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-muted">{label}</span>
            <span className={`figure ${color}`}>₹{fmt(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
