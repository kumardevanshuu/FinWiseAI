import React, { useState, useEffect } from "react";
import API from "../../services/api";

const fieldClass =
  "w-full bg-bg border border-border rounded-lg px-3 py-2 text-white focus:border-emerald outline-none transition-colors";

export default function GoalEditModal({ goal, onClose, onSaved }) {
  const [title, setTitle] = useState(goal.title || "");
  const [targetAmount, setTargetAmount] = useState(String(goal.target_amount || ""));
  const [savedAmount, setSavedAmount] = useState(String(goal.saved_amount || "0"));
  const [deadline, setDeadline] = useState(goal.deadline || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 20);
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await API.put(`/api/v1/goals/${goal.id}`, {
        title,
        target_amount: Number(targetAmount),
        saved_amount: Number(savedAmount),
        deadline: deadline || null,
      });

      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div
        className={`relative z-10 w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl transform transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-3 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold text-white mb-4">Edit goal</h2>

        {error && (
          <p className="text-sm text-rose bg-rose/10 border border-rose/30 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={save} className="space-y-4">
          <label className="block">
            <span className="block text-xs text-muted mb-1">Title</span>
            <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1">Target amount</span>
            <input
              type="number"
              className={fieldClass + " figure"}
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1">Saved amount</span>
            <input
              type="number"
              className={fieldClass + " figure"}
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1">Deadline</span>
            <input
              type="date"
              className={fieldClass}
              value={deadline || ""}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-muted hover:text-white px-2 py-1.5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="text-sm bg-amber text-bg px-4 py-1.5 rounded-full font-semibold hover:bg-amber-dark disabled:opacity-60 transition-colors"
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
