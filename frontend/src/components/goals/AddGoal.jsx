import React, { useState } from "react";
import API from "../../services/api";

const fieldClass =
  "w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:border-emerald outline-none transition-colors";

export default function AddGoal({ onAdded }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitGoal = async () => {
    setError("");
    if (!title || !targetAmount || !deadline) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/v1/goals/", {
        title,
        target_amount: Number(targetAmount),
        deadline,
      });

      setTitle("");
      setTargetAmount("");
      setDeadline("");

      onAdded();
    } catch (err) {
      console.error(err);
      setError("Couldn't add that goal. Try again.");
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
        placeholder="Goal title (e.g. Emergency fund)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className={fieldClass + " figure"}
        placeholder="Target amount"
        type="number"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
      />

      <input
        type="date"
        className={fieldClass}
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button
        onClick={submitGoal}
        disabled={loading}
        className="w-full bg-amber text-bg py-2.5 rounded-full text-sm font-semibold hover:bg-amber-dark transition-colors disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add goal"}
      </button>
    </div>
  );
}
