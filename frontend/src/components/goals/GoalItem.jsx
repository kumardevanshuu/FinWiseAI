// src/components/goals/GoalItem.jsx
import React, { useState } from "react";
import API from "../../services/api";

export default function GoalItem({ goal, onUpdated, onDeleted }) {
  const [amount, setAmount] = useState(goal.saved_amount || 0);
  const [loading, setLoading] = useState(false);

  const updateGoal = async () => {
    setLoading(true);
    try {
      await API.put(`/api/v1/goals/${goal.id}`, {
        title: goal.title,
        target_amount: goal.target_amount,
        saved_amount: Number(amount),
        deadline: goal.deadline || null,
      });

      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async () => {
    if (!window.confirm("Delete this goal?")) return;

    try {
      await API.delete(`/api/v1/goals/${goal.id}`);
      onDeleted?.();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-2">
      <h3 className="text-lg font-bold">{goal.title}</h3>

      <p>Target: ₹{goal.target_amount.toLocaleString()}</p>

      {goal.deadline && <p>Deadline: {goal.deadline}</p>}

      <input
        type="number"
        className="w-full p-2 bg-black rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={updateGoal}
          disabled={loading}
          className="px-3 py-1 bg-green-600 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Update"}
        </button>

        <button
          onClick={deleteGoal}
          className="px-3 py-1 bg-red-600 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
