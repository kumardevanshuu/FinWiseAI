import React, { useEffect, useState } from "react";
import { motion as Motion, useScroll, useTransform } from "framer-motion";
import API from "../services/api";

import AddTransaction from "../components/transactions/AddTransaction";
import MonthlyExpenseChart from "../components/charts/MonthlyExpenseChart";
import MonthlyIncomeChart from "../components/charts/MonthlyIncomeChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import FinanceSummary from "../components/summary/FinanceSummary";
import TransactionFilters from "../components/transactions/TransactionFilters";
import { expenseCategories } from "../data/categories";
import { useAuth } from "../context/AuthContext";

function fmt(n) {
  return Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [filters, setFilters] = useState({});
  const [editingTxn, setEditingTxn] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
  });

  // Scroll-linked parallax: background glow layers move at different
  // rates than the foreground content as the page scrolls.
  const { scrollY } = useScroll();
  const layerBackY = useTransform(scrollY, [0, 1200], [0, 260]);
  const layerMidY = useTransform(scrollY, [0, 1200], [0, -140]);
  const layerFrontY = useTransform(scrollY, [0, 1200], [0, 60]);

  const loadTransactions = () => {
    setLoading(true);
    API.get("/api/v1/transactions")
      .then((res) => setTxns(res.data || []))
      .catch((e) => setErr(e.response?.data?.detail || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await API.delete(`/api/v1/transactions/${id}`);
    loadTransactions();
  };

  const saveEdit = async () => {
    const body = { ...editForm, amount: Number(editForm.amount) };
    await API.put(`/api/v1/transactions/${editingTxn}`, body);
    setEditingTxn(null);
    loadTransactions();
  };

  const income = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const balance = income - expense;

  const categories = [...new Set(txns.map((t) => t.category))];
  const applyFilters = (f) => setFilters(f);

  let filteredTxns = [...txns];
  if (filters.search) {
    filteredTxns = filteredTxns.filter((t) =>
      t.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  if (filters.type) {
    filteredTxns = filteredTxns.filter((t) => t.type === filters.type);
  }
  if (filters.category) {
    filteredTxns = filteredTxns.filter((t) => t.category === filters.category);
  }
  if (filters.from) {
    filteredTxns = filteredTxns.filter(
      (t) => new Date(t.date) >= new Date(filters.from)
    );
  }
  if (filters.to) {
    filteredTxns = filteredTxns.filter(
      (t) => new Date(t.date) <= new Date(filters.to)
    );
  }

  const visibleTxns = filteredTxns.slice().reverse().slice(0, 10);
  const firstName = (user?.name || user?.email || "there").split(" ")[0];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-muted text-lg">
        Loading your dashboard…
      </div>
    );
  }
  if (err) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-rose">{err}</div>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Parallax layers — move at different speeds than the page scroll */}
      <Motion.div
        style={{ y: layerBackY }}
        className="glow-blob w-[500px] h-[500px] bg-emerald/10 top-0 left-1/4"
      />
      <Motion.div
        style={{ y: layerMidY }}
        className="glow-blob w-[420px] h-[420px] bg-violet/10 top-[600px] right-0"
      />
      <Motion.div
        style={{ y: layerFrontY }}
        className="glow-blob w-[360px] h-[360px] bg-amber/10 top-[1200px] left-0"
      />

      <div className="page-shell relative z-10">
        {/* Hero: running balance */}
        <Motion.div {...fadeIn} className="mb-9">
          <p className="page-kicker">Financial overview</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Good to see you, {firstName}.</h1>
              <p className="mt-1.5 text-sm text-muted">Here is the pulse of your money right now.</p>
            </div>
            <span className="rounded-full border border-emerald/25 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald-light">Live balance</span>
          </div>

          <div className="soft-card relative mt-7 overflow-hidden rounded-3xl p-6 md:p-7">
            <div className="absolute -right-14 -top-20 h-52 w-52 rounded-full bg-emerald/15 blur-3xl" />
            <div className="relative grid gap-6 md:grid-cols-[1.35fr_1fr] md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Available balance</p>
                <p
                  className={
                    "figure mt-2 text-4xl font-extrabold tracking-tight md:text-5xl " +
                    (balance >= 0 ? "text-white" : "text-rose")
                  }
                >
                  ₹{fmt(balance)}
                </p>
                <p className="mt-2 text-xs text-muted">Income less expenses across all recorded transactions.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald/15 bg-emerald/[0.07] p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-emerald-light">In</p>
                  <p className="figure mt-1.5 text-lg font-bold text-white">₹{fmt(income)}</p>
                </div>
                <div className="rounded-2xl border border-rose/15 bg-rose/[0.06] p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-rose">Out</p>
                  <p className="figure mt-1.5 text-lg font-bold text-white">₹{fmt(expense)}</p>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
          {/* Left column */}
          <div>
            <Motion.div {...fadeIn}>
              <TransactionFilters categories={categories} onFilter={applyFilters} />
            </Motion.div>

            <div className="mt-8 mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Recent entries</h2>
                <p className="mt-0.5 text-xs text-muted">Your latest money movement, at a glance.</p>
              </div>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-muted">{filteredTxns.length} shown</span>
            </div>

            {!visibleTxns.length ? (
              <p className="text-sm text-muted border-t border-border pt-6">
                No transactions yet. Add your first one to get started.
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/55 px-4">
                {visibleTxns.map((t, i) => (
                  <Motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.2) }}
                    className="group flex items-center justify-between border-b border-white/[0.07] py-3.5 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={(t.type === "income" ? "bg-emerald/12 text-emerald-light" : "bg-rose/12 text-rose") + " grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm"}>
                        {t.type === "income" ? "↗" : "↙"}
                      </span>
                      <div className="min-w-0">
                      <p className="text-white text-sm truncate">{t.title}</p>
                      <p className="text-xs text-muted">
                        {t.category || "Uncategorized"} · {t.date}
                      </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={
                          "figure text-sm font-medium " +
                          (t.type === "income" ? "text-emerald-light" : "text-rose")
                        }
                      >
                        {t.type === "income" ? "+" : "−"} ₹{fmt(t.amount)}
                      </span>

                      <button
                        className="text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        onClick={() => {
                          setEditingTxn(t.id);
                          setEditForm({
                            title: t.title,
                            amount: t.amount,
                            category: t.category,
                            type: t.type,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-muted hover:text-rose opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </Motion.div>
                ))}
              </div>
            )}

            <Motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="soft-card rounded-2xl p-5">
                <MonthlyExpenseChart />
              </div>
              <div className="soft-card rounded-2xl p-5">
                <MonthlyIncomeChart />
              </div>
            </Motion.div>

            <Motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="soft-card rounded-2xl p-5">
                <FinanceSummary />
              </div>
              <div className="soft-card rounded-2xl p-5">
                <CategoryPieChart />
              </div>
            </Motion.div>
          </div>

          {/* Right column: add transaction */}
          <Motion.div {...fadeIn}>
            <div className="soft-card sticky top-24 rounded-2xl p-6">
              <div className="mb-5 flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald/12 text-lg text-emerald-light">+</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Add transaction</h2>
                  <p className="mt-0.5 text-xs text-muted">Keep your picture current.</p>
                </div>
              </div>
              <AddTransaction onAdded={loadTransactions} />
            </div>
          </Motion.div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingTxn && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="soft-card w-full max-w-sm max-h-[90vh] overflow-auto rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Edit transaction</h2>

            <label className="block mb-3">
              <span className="block text-xs text-muted mb-1">Title</span>
              <input
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white focus:border-emerald outline-none"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </label>

            <label className="block mb-3">
              <span className="block text-xs text-muted mb-1">Amount</span>
              <input
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white figure focus:border-emerald outline-none"
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </label>

            <label className="block mb-2">
              <span className="block text-xs text-muted mb-1">Category</span>
              <input
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white focus:border-emerald outline-none"
                value={editForm.category || ""}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {expenseCategories.slice(0, 9).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setEditForm({ ...editForm, category: c })}
                  className={
                    "text-xs px-2.5 py-1 rounded-full border transition-colors " +
                    (editForm.category === c
                      ? "bg-emerald text-bg border-emerald"
                      : "border-border text-muted hover:text-white hover:border-faint")
                  }
                >
                  {c}
                </button>
              ))}
            </div>

            <label className="block mb-6">
              <span className="block text-xs text-muted mb-1">Type</span>
              <select
                className="w-full bg-bg border border-border py-2 px-3 rounded-lg text-white focus:border-emerald outline-none"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <div className="flex justify-between">
              <button
                className="text-sm text-muted hover:text-white px-3 py-1.5"
                onClick={() => setEditingTxn(null)}
              >
                Cancel
              </button>
              <button
                className="text-sm bg-emerald text-bg px-4 py-1.5 rounded-full font-semibold hover:bg-emerald-light transition-colors"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
