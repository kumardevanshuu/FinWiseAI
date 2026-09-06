// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import API from "../services/api";
import MonthlyExpenseChart from "../components/charts/MonthlyExpenseChart";
import MonthlyIncomeChart from "../components/charts/MonthlyIncomeChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4, ease: "easeOut" },
};

function fmt(n) {
  return Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/v1/finance")
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error("Analytics summary error:", err);
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-shell text-lg text-muted">Loading analytics…</div>;
  }
  if (!summary) {
    return <div className="page-shell text-rose">Failed to load analytics.</div>;
  }

  return (
    <div className="page-shell">
      <Motion.div {...fadeIn} className="mb-10">
        <p className="page-kicker text-violet">Financial insights</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">Know what your numbers are saying.</h1>
        <p className="mt-2 text-sm text-muted">A clear view of your cash flow, spending shape, and month-to-date pace.</p>
      </Motion.div>

      <Motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          ["Total income", summary.total_income, "text-emerald-light", "bg-emerald/10"],
          ["Total expenses", summary.total_expense, "text-rose", "bg-rose/10"],
          ["Remaining budget", summary.remaining_budget, "text-white", "bg-surface"],
        ].map(([label, value, color, bg]) => (
          <div key={label} className={`${bg} soft-card relative overflow-hidden rounded-2xl p-5`}>
            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/[0.04] blur-xl" />
            <p className="relative mb-1 text-xs font-semibold text-muted">{label}</p>
            <p className={`figure relative text-2xl font-bold ${color}`}>₹{fmt(value)}</p>
          </div>
        ))}
      </Motion.div>

      <Motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="soft-card rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald/12 text-xs text-emerald-light">⌁</span><h3 className="text-base font-bold text-white">Budget status</h3></div>
          {summary.overspending ? (
            <p className="text-sm text-rose">
              You're overspending this month — expenses have gone past income.
            </p>
          ) : (
            <p className="text-sm text-emerald-light">You're within budget this month.</p>
          )}
        </div>

        <div className="soft-card rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-rose/12 text-xs text-rose">↙</span><h3 className="text-base font-bold text-white">Largest outflow</h3></div>
          {summary.highest_category ? (
            <p className="text-sm text-muted">
              <span className="text-white">{summary.highest_category.category}</span>
              {" — "}
              <span className="figure text-white">₹{fmt(summary.highest_category.amount)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">No expenses recorded yet.</p>
          )}
        </div>
      </Motion.div>

      <Motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="soft-card rounded-2xl p-5">
          <MonthlyExpenseChart />
        </div>
        <div className="soft-card rounded-2xl p-5">
          <MonthlyIncomeChart />
        </div>
      </Motion.div>

      <Motion.div {...fadeIn} className="soft-card max-w-md rounded-2xl p-5">
        <CategoryPieChart />
      </Motion.div>
    </div>
  );
}
