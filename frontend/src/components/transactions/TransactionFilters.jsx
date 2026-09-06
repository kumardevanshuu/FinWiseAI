import React, { useState, useEffect, useMemo } from "react";
import { expenseCategories } from "../../data/categories";

const fieldClass =
  "bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-emerald outline-none transition-colors";

export default function TransactionFilters({ onFilter }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [catQuery, setCatQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    onFilter({ search, type, category, from, to });
  }, [search, type, category, from, to]);

  const filteredCategories = useMemo(() => {
    if (!catQuery) return expenseCategories;
    return expenseCategories.filter((c) =>
      c.toLowerCase().includes(catQuery.toLowerCase())
    );
  }, [catQuery]);

  const hasFilters = search || type || category || from || to;

  return (
    <div className="flex flex-wrap items-end gap-3 pb-4">
      <input
        className={fieldClass + " w-40"}
        placeholder="Search title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className={fieldClass}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <div className="relative">
        <input
          className={fieldClass + " w-36"}
          placeholder="Category…"
          value={category || catQuery}
          onChange={(e) => {
            setCatQuery(e.target.value);
            setCatOpen(true);
          }}
          onFocus={() => setCatOpen(true)}
        />
        {catOpen && (
          <div
            className="absolute z-30 bg-surfaceHover border border-border rounded-lg mt-1 max-h-44 overflow-auto w-52 shadow-lg"
            onMouseLeave={() => setCatOpen(false)}
          >
            <div
              className="p-2 text-sm cursor-pointer hover:bg-bg text-white"
              onMouseDown={(e) => {
                e.preventDefault();
                setCategory("");
                setCatQuery("");
                setCatOpen(false);
              }}
            >
              All categories
            </div>
            {filteredCategories.map((c) => (
              <div
                key={c}
                className="p-2 text-sm cursor-pointer hover:bg-bg text-white"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCategory(c);
                  setCatQuery(c);
                  setCatOpen(false);
                }}
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex flex-col">
        <span className="text-xs text-muted mb-1">From</span>
        <input
          type="date"
          className={fieldClass}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </label>

      <label className="flex flex-col">
        <span className="text-xs text-muted mb-1">To</span>
        <input
          type="date"
          className={fieldClass}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </label>

      {hasFilters && (
        <button
          className="text-sm text-muted hover:text-rose"
          onClick={() => {
            setSearch("");
            setType("");
            setCategory("");
            setFrom("");
            setTo("");
            setCatQuery("");
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
