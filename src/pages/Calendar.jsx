import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";

import "./CalendarPage.css";

function CalendarPage() {
  const { user } = useUser();

  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, "users", user.id, "workAreas")
      );

      let allTasks = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const tasksArray = data.tasksArray || [];

        tasksArray.forEach((task) => {
          allTasks.push({
            ...task,
            workArea: data.name,
          });
        });
      });

      setTasks(allTasks);
    };

    fetchTasks();
  }, [user]);

  const formatDate = (d) => {
    if (!d) return "";

    if (d?.toDate) {
        return d.toDate().toISOString().split("T")[0];
    }

    if (typeof d === "string") {
        return d.split("T")[0];
    }

    return "";
  }

  const selectedDate = date.getFullYear() + "-" +
  String(date.getMonth() + 1).padStart(2, "0") + "-" +
  String(date.getDate()).padStart(2, "0");

  const tasksForDay = tasks.filter(
    (task) => task.deadline === selectedDate
  );

  const getDateOnly = (value) => {
    if (value?.toDate) {
        return value.toDate().toISOString().split("T")[0];
    }
    return value?.toString().split("T")[0];
  };

  const tasksByDate = tasks.reduce((acc,task) => {
    const date = getDateOnly(task.deadline);

    if(!acc[date]) acc[date] = [];

    acc[date].push(task);
    return acc;
  }, {});

  return (
    <div className="calendar-page">

      {/* Header */}
      <div className="calendar-header">
        <h1>📅 Calendar</h1>
        <p>Track your tasks and stay consistent</p>
      </div>

      <div className="calendar-layout">

        {/* Calendar Section */}
        <div className="calendar-box">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({date,view}) => {
                if(view !== "month") return null;

                const key=
                  date.getFullYear() +
                  "-" +
                  String(date.getMonth() + 1).padStart(2,"0") +
                  "-" +
                  String(date.getDate()).padStart(2,"0");
                  
                const dayTasks = tasksByDate[key];

                if(!dayTasks || dayTasks.length === 0) return null;

                const hasCompleted = dayTasks.some((t) => t.completed);
                const hasPending = dayTasks.some((t) => !t.completed);

                return (
                    <div className="dot-container">
                        {hasPending && <span className="dot pending-dot"></span>}
                        {hasCompleted && <span className="dot done-dot"></span>}
                    </div>
                    
                );

            }}
            />
        </div>

        {/* Tasks Section */}
        <div className="task-panel">

          <div className="task-header">
            <h2>Tasks</h2>
            <span className="date-badge">{selectedDate}</span>
          </div>

          {tasksForDay.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks scheduled 🎉</h3>
              <p>Enjoy your free time or plan something new.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasksForDay.map((task) => (
                <div key={task.id} className="task-card">

                  <div className="task-top">
                    <h3>{task.name}</h3>
                    <span
                      className={`status ${
                        task.completed ? "done" : "pending"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <p className="workarea">📂 {task.workArea}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;