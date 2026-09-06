// src/components/goals/AddGoalForm.jsx
import React, { useState } from "react";
import API from "../../services/api";

export default function AddGoalForm({ onAdded }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !targetAmount) {
      setError("Please provide a title and target amount.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/v1/goals/", {
        title,
        target_amount: parseFloat(targetAmount),
        deadline: deadline || null,
      });
      setTitle("");
      setTargetAmount("");
      setDeadline("");
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Failed to create goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Emergency Fund"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Target Amount</label>
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="e.g., 50000"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Deadline (optional)</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Goal"}
        </button>
      </div>
    </form>
  );
}
