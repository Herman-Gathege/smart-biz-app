import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentPage from "./AppointmentPage"; // You'll create this
import { fetchWithAuth } from "../services/fetchWithAuth";

import "../styles/Dashboard.css"; // Optional: style like TeacherDashboard
import CompletedAppointmentsWidget from "./CompletedAppointmentsWidget";
import Navbar from "./Navbar"; // Adjust path if needed
import RevenueTracker from "./RevenueTracker";
import { Link } from "react-router-dom";
import Customers from "./Customers";

import BusinessStatsWidget from "./BusinessStatsWidget";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:5000/me");

        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        } else {
          const errorData = await res.json();
          console.error("Fetch /me error:", errorData);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Network error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <h3 className="welcome-message">Welcome, {email}! 👋</h3>
            <div className="widget-container">
              <CompletedAppointmentsWidget />
              <BusinessStatsWidget />
            </div>
          </>
        );
      case "appointments":
        return <AppointmentPage />;
      case "revenue":
        return <RevenueTracker />;
      case "customers":
        return <Customers />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <Link to="/">
          <img src="/logodash.png" alt="SmartBizDash Logo" className="logo" />
        </Link>{" "}
        <ul>
          <li
            onClick={() => {
              setActiveSection("dashboard");
              setSidebarOpen(false);
            }}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            Dashboard
          </li>
          <li
            onClick={() => {
              setActiveSection("appointments");
              setSidebarOpen(false);
            }}
            className={activeSection === "appointments" ? "active" : ""}
          >
            Appointments
          </li>
          <li
            onClick={() => {
              setActiveSection("revenue");
              setSidebarOpen(false);
            }}
            className={activeSection === "revenue" ? "active" : ""}
          >
            RevenueTracker
          </li>
          <li
            onClick={() => {
              setActiveSection("customers");
              setSidebarOpen(false);
            }}
            className={activeSection === "customers" ? "active" : ""}
          >
            Customers
          </li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>

      <div className="content">
        {/* Hamburger button for mobile */}
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>

        <Navbar
          title={
            activeSection === "appointments"
              ? "Appointment Manager"
              : activeSection === "revenue"
              ? "Revenue Tracker"
              : activeSection === "customers"
              ? "Customer Manager"
              : "Dashboard"
          }
          email={email}
        />

        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
