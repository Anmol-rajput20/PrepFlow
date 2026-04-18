import React, { useState } from "react";
import WorkArea from "./WorkArea";
import "./Dashboard.css";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function Dashboard() {
  const [workAreas, setWorkAreas] = useState([
    {
      id: 1,
      name: "DSA",
      priority: "High",
      tasksArray: [
        { id: 101, name: "Arrays", completed: true, deadline: "2026-01-20" },
        { id: 102, name: "Linked List", completed: false, deadline: "2026-01-25" },
        { id: 103, name: "Stack", completed: false, deadline: "2026-01-28" },
      ],
    },
    {
      id: 2,
      name: "Classes",
      priority: "Medium",
      tasksArray: [
        { id: 201, name: "Attend Lecture 1", completed: true, deadline: "2026-01-28" },
        { id: 202, name: "Submit Assignment", completed: false, deadline: "2026-01-22" },
      ],
    },
  ]);
  
  const {user} = useUser();
  const [newName, setNewName] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  const addWorkArea = () => {
    if (!newName.trim()) return;

    const newArea = {
      id: Date.now(),
      name: newName,
      priority: newPriority,
      tasksArray: [],
    };

    setWorkAreas([newArea, ...workAreas]);
    setNewName("");
    setNewPriority("Medium");
  };

  const deleteWorkArea = (id) => {
    setWorkAreas(workAreas.filter((area) => area.id !== id));
  };

  return (
    <>
      {/* Hero Header */}
      <div className="hero-section">
        <div className="hero-card">
          {/* Left side */}
          <div className="hero-left">
            <div className="hero-icon">📘</div>

            <div className="hero-text">
              <h1>PrepFlow</h1>
              <p>Organize your work areas and conquer your goals! 🎯</p>
            </div>
          </div>

          {/* Right side auth */}
          <div className="hero-right">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="signin-btn">Sign In</button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="signup-btn">Sign Up</button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="user-info">
                <span className="welcome-text">
                  Welcome, {user?.firstName || user?.username || "User"} 👋
                </span>
                <UserButton/>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-container">
        {/* Add Work Area */}
        <div className="add-work-area-card">
          <div className="section-title">
            <div className="plus-icon">＋</div>
            <h2>Add New Work Area</h2>
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Enter work area name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <button onClick={addWorkArea}>+ Add Work Area</button>
          </div>
        </div>

        {/* Work Areas / Empty State */}
        {workAreas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h2>No work areas yet</h2>
            <p>
              Start by adding a work area above to organize your tasks and track
              your progress.
            </p>
          </div>
        ) : (
          <div className="work-areas-list">
            {workAreas.map((area) => (
              <WorkArea
                key={area.id}
                data={area}
                onDelete={deleteWorkArea}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;