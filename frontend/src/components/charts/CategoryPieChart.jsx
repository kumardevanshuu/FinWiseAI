import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  "#10B981", "#FB7185", "#F59E0B", "#A78BFA",
  "#34D399", "#38BDF8", "#F472B6", "#94A3B8",
];

export default function CategoryPieChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/v1/transactions")
      .then((res) => {
        const expenses = res.data.filter((t) => t.type === "expense");

        const grouped = {};
        expenses.forEach((t) => {
          grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount);
        });

        const labels = Object.keys(grouped);
        const values = Object.values(grouped);

        setChartData({
          labels,
          datasets: [
            {
              label: "Expenses by category",
              data: values,
              backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
              borderColor: "#141516",
              borderWidth: 2,
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading category chart…</p>;
  if (!chartData || chartData.labels.length === 0)
    return <p className="text-sm text-muted">No expense data yet.</p>;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: { color: "#9CA3AF", font: { family: "Inter", size: 12 } },
      },
      tooltip: { mode: "nearest" },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-3">Expenses by category</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
}
