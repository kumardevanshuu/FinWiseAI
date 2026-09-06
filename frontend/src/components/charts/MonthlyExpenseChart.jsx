import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyExpenseChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/v1/transactions")
      .then((res) => {
        const expenses = res.data.filter((t) => t.type === "expense");

        const grouped = {};
        expenses.forEach((t) => {
          const month = new Date(t.date).toLocaleString("en", { month: "short" });
          grouped[month] = (grouped[month] || 0) + t.amount;
        });

        const labels = Object.keys(grouped);
        const values = Object.values(grouped);

        setChartData({
          labels,
          datasets: [
            {
              label: "Monthly expense",
              data: values,
              backgroundColor: "#FB7185",
              borderRadius: 4,
              maxBarThickness: 28,
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading monthly expenses…</p>;
  if (!chartData) return <p className="text-sm text-rose">Failed to load chart.</p>;

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9CA3AF", font: { family: "Inter", size: 11 } } },
      y: {
        beginAtZero: true,
        grid: { color: "#26282B" },
        ticks: { color: "#9CA3AF", font: { family: "Inter", size: 11 } },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-3">Monthly expense</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
