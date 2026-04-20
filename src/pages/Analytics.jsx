import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import "./Analytics.css";

function Analytics() {
  const { user } = useUser();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  const [areaData, setAreaData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, "users", user.id, "workAreas")
      );

      let total = 0;
      let completed = 0;
      let overdue = 0;

      let workAreaStats = [];

      const today = new Date().toISOString().split("T")[0];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const tasks = data.tasksArray || [];

        // Count tasks
        tasks.forEach((task) => {
          total++;

          if (task.completed) {
            completed++;
          } else if (task.deadline < today) {
            overdue++;
          }
        });

        // Work area stats
        workAreaStats.push({
          name: data.name,
          tasks: tasks.length,
        });
      });

      setStats({
        total,
        completed,
        pending: total - completed,
        overdue,
      });

      setAreaData(workAreaStats);
    };

    fetchData();
  }, [user]);

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const percentage =
    stats.total === 0
      ? 0
      : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="analytics-container">
      <h1>📊 Analytics Dashboard</h1>

      {/* Cards */}
      <div className="analytics-cards">
        <div className="card">Total Tasks: {stats.total}</div>
        <div className="card">Completed: {stats.completed}</div>
        <div className="card">Pending: {stats.pending}</div>
        <div className="card">Overdue: {stats.overdue}</div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <h3>Completion Rate: {percentage}%</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h2>Task Distribution</h2>
        <PieChart width={350} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h2>Work Area Activity</h2>
        <BarChart width={500} height={300} data={areaData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tasks" fill="#3b82f6" />
        </BarChart>
      </div>
    </div>
  );
}

export default Analytics;