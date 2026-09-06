import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import API from "../services/api";
import AddGoal from "../components/goals/AddGoal";
import GoalCard from "../components/goals/GoalCard";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = () => {
    API.get("/api/v1/goals/")
      .then((res) => setGoals(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <div className="page-shell">
      <Motion.div {...fadeIn} className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="page-kicker text-amber">Intentional saving</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">Your goals, in motion.</h1>
          <p className="mt-2 text-sm text-muted">Set a destination and let every saved rupee move you closer.</p>
        </div>
        <div className="soft-card min-w-40 rounded-2xl px-4 py-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted">Active goals</p>
          <p className="mt-1 text-2xl font-bold text-white">{goals.length}</p>
        </div>
      </Motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
        <div>
          {loading ? (
            <p className="text-sm text-muted">Loading goals…</p>
          ) : goals.length === 0 ? (
            <div className="soft-card rounded-2xl px-6 py-10 text-center">
              <span className="grid mx-auto h-11 w-11 place-items-center rounded-2xl bg-amber/12 text-xl text-amber">◎</span>
              <p className="mt-4 text-sm font-semibold text-white">Give your savings a destination.</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted">Create your first goal to turn spare money into visible progress.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {goals.map((g, i) => (
                <Motion.div
                  key={g.id}
                  {...fadeIn}
                  transition={{ ...fadeIn.transition, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <GoalCard goal={g} onUpdated={loadGoals} onDeleted={loadGoals} />
                </Motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="soft-card sticky top-24 rounded-2xl p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber/15 text-lg text-amber">⌁</span>
              <div>
                <h2 className="text-lg font-bold text-white">Create a goal</h2>
                <p className="mt-0.5 text-xs text-muted">A small step toward something big.</p>
              </div>
            </div>
            <AddGoal onAdded={loadGoals} />
          </div>
        </div>
      </div>
    </div>
  );
}
