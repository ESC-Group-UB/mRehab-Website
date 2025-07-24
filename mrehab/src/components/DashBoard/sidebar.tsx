import React from "react";
import { useLocation } from "react-router-dom";
import "./sidebar.module.css";

const navItems = [
  { label: "Dashboard Home", path: "/dashboard" },
  { label: "Patient List", path: "/dashboard/patients" },
  { label: "Add Viewer", path: "/dashboard/add-viewer" },
  { label: "Profile Settings", path: "/dashboard/settings" },
  { label: "Billing", path: "/dashboard/billing" },
  { label: "Log Out", path: "/logout" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">🩺 mRehab</h2>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
