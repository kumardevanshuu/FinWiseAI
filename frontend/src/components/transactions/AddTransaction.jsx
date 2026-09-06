// src/components/transactions/AddTransaction.jsx
import React, { useState, useMemo } from "react";
import API from "../../services/api";
import { expenseCategories, incomeCategories } from "../../data/categories";

const fieldClass =
  "w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:border-emerald outline-none transition-colors";

function CategoryPicker({ value, onChange, options, placeholder = "Category" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((c) => c.toLowerCase().includes(q));
  }, [query, options]);

  return (
    <div className="relative">
      <input
        className={fieldClass}
        placeholder={placeholder}
        value={query || value}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => setQuery(e.target.value)}
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setQuery("");
          }}
          className="mt-1.5 text-xs text-muted hover:text-white"
        >
          Clear: {value}
        </button>
      )}

      {open && (
        <div className="absolute z-40 w-full bg-surfaceHover border border-border rounded-lg mt-1 max-h-44 overflow-auto shadow-lg">
          {list.length === 0 ? (
            <div className="p-2 text-sm text-muted">No categories</div>
          ) : (
            list.map((c) => (
              <div
                key={c}
                className="p-2 hover:bg-bg cursor-pointer text-sm text-white"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(c);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {c}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AddTransaction({ onAdded }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = type === "income" ? incomeCategories : expenseCategories;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(""); // clear category since the list changes with type
  };

  const addTxn = async () => {
    setError("");
    if (!title || !amount || !category) {
      setError("Title, amount, and category are required.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/v1/transactions/", {
        title,
        amount: Number(amount),
        category,
        type,
        notes,
        date: date || null,
      });

      setTitle("");
      setAmount("");
      setCategory("");
      setType("expense");
      setNotes("");
      setDate("");

      if (onAdded) onAdded();
    } catch (err) {
      console.error("Add txn error:", err);
      setError("Couldn't add that transaction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs text-rose bg-rose/10 border border-rose/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <input
        className={fieldClass}
        placeholder="Title (e.g. Salary, Groceries)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Income / Expense toggle — right after Title */}
      <div className="flex bg-bg border border-border rounded-full p-1">
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={
            "flex-1 text-center text-sm font-medium py-1.5 rounded-full transition-colors " +
            (type === "income" ? "bg-emerald text-bg" : "text-muted hover:text-white")
          }
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={
            "flex-1 text-center text-sm font-medium py-1.5 rounded-full transition-colors " +
            (type === "expense" ? "bg-rose text-bg" : "text-muted hover:text-white")
          }
        >
          Expense
        </button>
      </div>

      <input
        className={fieldClass + " figure"}
        placeholder="Amount"
        value={amount}
        type="number"
        onChange={(e) => setAmount(e.target.value)}
      />

      <CategoryPicker
        value={category}
        onChange={setCategory}
        options={categoryOptions}
        placeholder={type === "income" ? "Income category" : "Expense category"}
      />

      <input
        className={fieldClass}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <textarea
        className={fieldClass + " resize-none"}
        placeholder="Notes (optional)"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={addTxn}
        className="w-full bg-emerald text-bg py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-light transition-colors disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Adding…" : "Add transaction"}
      </button>
    </div>
  );
}