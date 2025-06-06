import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../api";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        api.get("/auth/logout").then((result) => {
            if (result.data.Status) {
                localStorage.removeItem("valid");
                navigate("/");
                window.location.reload();
            }
        });
    };

    // Check if current route matches the nav item
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <div
                className="text-white p-3"
                style={{
                    width: "250px",
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    overflowY: "auto",
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <h5 className="mb-4 text-center" style={{
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#a5b4fc",
                    fontWeight: "600",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontSize: "0.9rem"
                }}>
                    EMPLOYEE MS
                </h5>
                <ul className="nav nav-pills flex-column">
                    {[
                        { path: "/dashboard", icon: "bi-speedometer2", text: "Dashboard" },
                        { path: "/dashboard/employee", icon: "bi-people", text: "Manage Users" },
                        { path: "/dashboard/category", icon: "bi-columns", text: "Category" },
                        { path: "/dashboard/Projects", icon: "bi-folder-plus", text: "Add Projects" },
                        { path: "/dashboard/AssignEmployee", icon: "bi-person-check", text: "Assign Employee" },
                        { path: "/dashboard/EmployeeProjects", icon: "bi-file-earmark-person", text: "Projects" },
                        { path: "/dashboard/SalaryLog", icon: "bi-credit-card", text: "Salary Log" },
                        { path: "/dashboard/AddAdminForm", icon: "bi-person-plus", text: "Add Admin" },
                    ].map((item) => (
                        <li className="nav-item mb-2" key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link d-flex align-items-center w-100 ${
                                    isActive(item.path) ? "active-nav-item" : ""
                                }`}
                                style={{
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                    background: isActive(item.path)
                                        ? "rgba(165, 180, 252, 0.2)"
                                        : "transparent",
                                    border: isActive(item.path)
                                        ? "1px solid rgba(165, 180, 252, 0.3)"
                                        : "1px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.border = "1px solid transparent";
                                    }
                                }}
                            >
                                <i className={`bi ${item.icon} me-3`} style={{
                                    color: isActive(item.path) ? "#a5b4fc" : "rgba(255, 255, 255, 0.8)"
                                }} />
                                <span style={{
                                    color: isActive(item.path) ? "white" : "rgba(255, 255, 255, 0.8)",
                                    fontWeight: isActive(item.path) ? "500" : "400"
                                }}>
                  {item.text}
                </span>
                            </Link>
                        </li>
                    ))}

                    {/* Logout Button */}
                    <li className="nav-item mt-4 pt-2" style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                        <button
                            onClick={handleLogout}
                            className="nav-link d-flex align-items-center w-100"
                            style={{
                                background: "rgba(244, 63, 94, 0.2)",
                                borderRadius: "8px",
                                border: "1px solid rgba(244, 63, 94, 0.3)",
                                padding: "10px 15px",
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                color: "rgba(255, 255, 255, 0.8)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(244, 63, 94, 0.3)";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)";
                                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                            }}
                        >
                            <i className="bi bi-power me-3" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div
                className="flex-grow-1"
                style={{
                    marginLeft: "250px",
                    overflowY: "auto",
                    height: "100vh",
                    background: "#f8f9fa"
                }}
            >
                <div className="p-3 shadow text-center" style={{
                    background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
                }}>
                    <h4 style={{
                        color: "#334155",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                        margin: 0
                    }}>
                        Employee Management System
                    </h4>
                </div>
                <div className="p-3" style={{ minHeight: "calc(100vh - 70px)" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;