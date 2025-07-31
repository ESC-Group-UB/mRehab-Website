import React from "react";
import { Sidebar } from "../../components/DashBoard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <main style={{ marginLeft: "240px", padding: "2rem", flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
