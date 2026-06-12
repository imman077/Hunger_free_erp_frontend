"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDashboardStore } from "../../modules/admin/dashboard/store/dashboard-store";
import type { ChartDataset } from "../../modules/admin/dashboard/store/dashboard-schemas";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart() {
  const { data } = useDashboardStore();
  const { userGrowthChart } = data;

  if (!userGrowthChart) {
    return (
      <div className="flex items-center justify-center h-full text-[10px] text-slate-400">
        No data available
      </div>
    );
  }

  const chartData = {
    labels: userGrowthChart.labels,
    datasets: userGrowthChart.datasets.map((dataset: ChartDataset) => ({
      ...dataset,
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          font: { size: 10, weight: "bold" as const },
          color: "rgba(156, 163, 175, 0.5)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 10, weight: "bold" as const },
          color: "rgba(156, 163, 175, 0.5)",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
