import { useState, useEffect } from "react";
import SubscriptionOptions from './SubscriptionOptions'; // Import the Subscription component
import Profile from './Profile'; // Import the Profile component
import "./css/index.css";
import NavBar from "./NavBar";

// Define the TypeScript interface for the child data
interface Child {
  id: number;
  username: string;
  grade: string;
  years: string;
  subjects: string[];
  profilePicture: string;
}

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("Inactive");
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/children");
        if (response.ok) {
          const data = await response.json();
          setChildren(data.children);
        } else {
          console.error("Failed to fetch children");
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchChildren();
  }, []);

  // Assuming you want to show the profile of the first child in the list
  const selectedChild = children[0];

  return (
    <>
    <NavBar/>
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li onClick={() => setActiveSection("profile")}>Profile</li>
          <li onClick={() => setActiveSection("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveSection("children")}>Registered Children</li>
          <li onClick={() => setActiveSection("competitions")}>Competitions</li>
          <li onClick={() => setActiveSection("notifications")}>Notifications</li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="content">
        {activeSection === "dashboard" && (
          <div>
            <h1 className="dashboard-title">Parent Dashboard</h1>
            <div className="card">
              <h2 className="card-title">Subscription Status</h2>
              <p>Status: <span className="status-active">{subscriptionStatus}</span></p>
              <button className="button" onClick={() => setActiveSection("subscription")}>Manage Subscription</button>
            </div>
          </div>
        )}

        {activeSection === "children" && (
          <div className="card">
            <h2 className="card-title">Registered Children</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Username</th>
                  <th>Grade</th>
                  <th>Years</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {children.map((child) => (
                  <tr key={child.id}>
                    <td>
                      {child.profilePicture ? (
                        <img
                          src={`http://localhost:4000/${child.profilePicture}`}
                          alt="Profile"
                          width="50"
                          height="50"
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td>{child.username}</td>
                    <td>{child.grade}</td>
                    <td>{child.years}</td>
                    <td>{Array.isArray(child.subjects) ? child.subjects.join(", ") : JSON.parse(child.subjects).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="button" onClick={() => setActiveSection("registerChild")}>Register New Child</button>
          </div>
        )}

        {activeSection === "profile" && selectedChild && (
          <Profile /> // Pass selectedChild correctly
        )}

        {activeSection === "subscription" && <SubscriptionOptions setSubscriptionStatus={setSubscriptionStatus} />}
      </div>
    </div>
    </>

  );
};

export default ParentDashboard;
