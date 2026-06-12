"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDashboardStore } from "../../modules/admin/dashboard/store/dashboard-store";
import type { ChartDataset } from "../../modules/admin/dashboard/store/dashboard-schemas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function LineChart() {
  const { data } = useDashboardStore();
  const { donationsChart } = data;

  if (!donationsChart) {
    return (
      <div className="flex items-center justify-center h-full">
        No data available
      </div>
    );
  }

  const chartData = {
    labels: donationsChart.labels,
    datasets: donationsChart.datasets.map((dataset: ChartDataset) => ({
      ...dataset,
      tension: 0.1,
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

  return <Line data={chartData} options={options} />;
}
