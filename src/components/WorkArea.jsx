import React, { useState, useEffect } from "react";
import "./WorkArea.css";

function WorkArea({ data, onDelete }) {
  const [subtasks, setSubtasks] = useState(data.tasksArray || []);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [progress, setProgress] = useState(0);

  // Update progress automatically
  useEffect(() => {
    const total = subtasks.length;
    const completed = subtasks.filter((task) => task.completed).length;

    setProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
  }, [subtasks]);

  // Add new subtask
  const addSubtask = () => {
    if (!newTask.trim() || !newDeadline) return;

    const newSubtask = {
      id: Date.now(),
      name: newTask,
      completed: false,
      deadline: newDeadline,
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewTask("");
    setNewDeadline("");
  };

  // Toggle task completion
  const toggleSubtask = (id) => {
    setSubtasks(
      subtasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete subtask
  const deleteSubtask = (id) => {
    setSubtasks(subtasks.filter((task) => task.id !== id));
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