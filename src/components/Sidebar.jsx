import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
    { name: "Calendar", path: "/calendar", icon: "📅" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <div className="sidebar">
      <div className="logo">🚀 PrepFlow</div>

      <div className="menu">
        {menu.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;