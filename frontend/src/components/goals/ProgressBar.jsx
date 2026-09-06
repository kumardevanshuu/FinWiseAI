// src/components/goals/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ current = 0, target = 0 }) {
  const percent = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  const color =
    percent < 40 ? "bg-rose" : percent < 80 ? "bg-amber" : "bg-emerald";

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-muted mb-1.5">
        <span className="figure">₹{Number(current).toLocaleString("en-IN")} saved</span>
        <span className="figure">{percent}%</span>
      </div>

      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`${color} h-1.5 transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
