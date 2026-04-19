import React, { useState, useEffect } from "react";
import "./WorkArea.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {v4 as uuidv4} from "uuid";

function WorkArea({ data, onDelete ,docId,userId}) {
  const [subtasks, setSubtasks] = useState(data.tasksArray || []);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setSubtasks(data.tasksArray || []);
  }, [data.tasksArray]);

  

  // Update progress automatically
  useEffect(() => {
    const total = subtasks.length;
    const completed = subtasks.filter((task) => task.completed).length;

    setProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
  }, [subtasks]);

  // Add new subtask
  const addSubtask = async () => {
    if (!newTask.trim() || !newDeadline) return;

    const updated = [
      ...subtasks,
      {
        id: uuidv4(),
        name: newTask,
        completed: false,
        deadline: newDeadline,
      },
    ];

    setSubtasks(updated);

    try{
      await updateDoc(doc(db,"users",userId,"workAreas",docId), {
        tasksArray: updated,
      });
    } catch(err){
      console.error(err);
    }

    setNewTask("");
    setNewDeadline("");
  };

  // Toggle task completion
  const toggleSubtask = async (id) => {
    const updated = subtasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task

    );

    setSubtasks(updated);

    await updateDoc(doc(db,"users",userId,"workAreas",docId), {
      tasksArray: updated,
    });
  };

  // Delete subtask
  const deleteSubtask = async (id) => {
    const updated = subtasks.filter((task) => task.id !== id);
   

    setSubtasks(updated);

    await updateDoc(doc(db,"users",userId,"workAreas",docId), {
      tasksArray : updated,
    });
  };

  // Deadline status
  const getDeadlineStatus = (task) => {
    if (task.completed) return "completed";

    const today = new Date().toISOString().split("T")[0];

    if (task.deadline < today) return "overdue";
    if (task.deadline === today) return "today";

    return "upcoming";
  };

  // Deadline text
  const getDeadlineText = (task) => {
    if (task.completed) return "Completed";

    const today = new Date();
    const deadline = new Date(task.deadline);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} day(s) overdue`;
    if (diffDays === 0) return "Due today";

    return `${diffDays} day(s) left`;
  };

  return (
    <div className="work-area-card">
      {/* Header */}
      <div className="work-area-header">
        <div>
          <h3>{data.name}</h3>
          <p className="task-count">
            {subtasks.filter((task) => task.completed).length} /{" "}
            {subtasks.length} tasks completed
          </p>
        </div>

        <span className={`priority ${data.priority.toLowerCase()}`}>
          {data.priority}
        </span>
      </div>

      {/* Progress */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <span className="progress-text">{progress}%</span>
      </div>

      {/* Subtasks */}
      <div className="subtasks">
        {subtasks.length === 0 ? (
          <p className="empty-subtasks">
            No tasks yet. Add your first task below.
          </p>
        ) : (
          [...subtasks]
            .sort((a, b) => {
              const order = {
                overdue: 1,
                today: 2,
                upcoming: 3,
                completed: 4,
              };

              return (
                order[getDeadlineStatus(a)] -
                order[getDeadlineStatus(b)]
              );
            })
            .map((task) => (
              <div
                key={task.id}
                className={`subtask-item ${getDeadlineStatus(task)}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleSubtask(task.id)}
                />

                <div className="subtask-content">
                  <span
                    className={task.completed ? "completed-text" : ""}
                  >
                    {task.name}
                  </span>

                  <small>
                    {getDeadlineStatus(task) === "overdue" && "⚠️ "}
                    {getDeadlineText(task)}
                  </small>
                </div>

                <button
                  className="delete-task-btn"
                  onClick={() => deleteSubtask(task.id)}
                >
                  ×
                </button>
              </div>
            ))
        )}

        {/* Add Subtask */}
        <div className="add-subtask">
          <input
            type="text"
            placeholder="Add subtask..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />

          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />

          <button onClick={addSubtask}>+ Add Task</button>
        </div>
      </div>

      {/* Delete Work Area */}
      <button
        className="delete-btn"
        onClick={() => onDelete(data.id)}
      >
        Delete Work Area
      </button>
    </div>
  );
}

export default WorkArea;