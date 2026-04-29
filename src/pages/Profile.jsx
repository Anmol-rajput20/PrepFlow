import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import "./Profile.css";

function Profile() {
  const { user } = useUser();

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar">
          <img src={user?.imageUrl} alt="User" />
        </div>

        <div className="profile-info">
          <h1>{user?.fullName || "Student User"}</h1>
          <p>{user?.primaryEmailAddress?.emailAddress}</p>

          <div className="profile-badges">
            <span>🎓 Student</span>
            <span>🚀 PrepFlow User</span>
          </div>
        </div>

        <div className="profile-action">
          <UserButton />
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Account Details</h3>
          <p><strong>Name:</strong> {user?.fullName || "Not provided"}</p>
          <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
        </div>

        <div className="profile-card">
          <h3>Productivity Focus</h3>
          <p>Manage academic workload, deadlines, tasks, and progress from one personalized dashboard.</p>
        </div>

        <div className="profile-card">
          <h3>Current Features</h3>
          <ul>
            <li>Custom work areas</li>
            <li>Deadline tracking</li>
            <li>Progress analytics</li>
            <li>Push notifications</li>
          </ul>
        </div>

        <div className="profile-card highlight-card">
          <h3>PrepFlow Goal</h3>
          <p>Reduce academic stress by helping students stay organized, consistent, and deadline-aware.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;