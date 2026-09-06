// src/components/goals/GoalCard.jsx
import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import GoalEditModal from "./GoalEditModal";
import ModalPortal from "../ModalPortal";
import API from "../../services/api";

export default function GoalCard({ goal, onUpdated, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Delete this goal?")) return;
    setDeleting(true);
    setError("");

    try {
      await API.delete(`/api/v1/goals/${goal.id}`);
      onDeleted?.();
    } catch (err) {
      console.error(err);
      setError("Couldn't delete this goal.");
    } finally {
      setDeleting(false);
    }
  };

  const deadlineFormatted = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-faint transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-amber/15 text-amber flex items-center justify-center text-base">
            🎯
          </span>
          <h4 className="text-base font-bold text-white">{goal.title}</h4>
        </div>
        <span className="text-xs text-muted">{deadlineFormatted}</span>
      </div>

      <p className="text-sm text-muted mt-3">
        Target{" "}
        <span className="figure text-white">
          ₹{Number(goal.target_amount).toLocaleString("en-IN")}
        </span>
      </p>

      <ProgressBar current={goal.saved_amount} target={goal.target_amount} />

      {error && <p className="text-xs text-rose mt-2">{error}</p>}

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => setEditOpen(true)}
          className="text-sm text-muted hover:text-white transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-muted hover:text-rose transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      {editOpen && (
        <ModalPortal>
          <GoalEditModal
            goal={goal}
            onClose={() => setEditOpen(false)}
            onSaved={() => {
              setEditOpen(false);
              onUpdated?.();
            }}
          />
        </ModalPortal>
      )}
    </div>
  );
}
