import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../api";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <div
                className="text-white d-flex flex-column"
                style={{
                    width: isSidebarCollapsed ? "60px" : "250px",
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    overflowY: "auto",
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "width 0.3s ease",
                    paddingLeft: isSidebarCollapsed ? "0" : "1rem",
                    paddingRight: isSidebarCollapsed ? "0" : "1rem",
                }}
            >
                <div
                    className="d-flex align-items-center justify-content-between"
                    style={{
                        padding: "10px 0",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#a5b4fc",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontSize: "0.9rem",
                        paddingLeft: isSidebarCollapsed ? "1rem" : "0",
                        paddingRight: isSidebarCollapsed ? "1rem" : "0",
                        whiteSpace: "nowrap",
                    }}
                >
                    <h5
                        className="mb-0"
                        style={{
                            flexGrow: 1,
                            textAlign: isSidebarCollapsed ? "center" : "left",
                            display: isSidebarCollapsed ? "none" : "block",
                            userSelect: "none",
                        }}
                    >
                        EMPLOYEE MS
                    </h5>
                    {/* Hamburger Icon */}
                    <button
                        onClick={toggleSidebar}
                        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#a5b4fc",
                            fontSize: "1.4rem",
                            cursor: "pointer",
                            padding: 0,
                            marginLeft: isSidebarCollapsed ? "auto" : "0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                        }}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>

                <ul
                    className="nav nav-pills flex-column flex-grow-1"
                    style={{ gap: "0.5rem", paddingTop: "1rem" }}
                >
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
                        <li className="nav-item" key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link d-flex align-items-center ${
                                    isActive(item.path) ? "active-nav-item" : ""
                                }`}
                                style={{
                                    borderRadius: "8px",
                                    padding: isSidebarCollapsed ? "10px 0" : "10px 15px",
                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                    background: isActive(item.path)
                                        ? "rgba(165, 180, 252, 0.2)"
                                        : "transparent",
                                    border: isActive(item.path)
                                        ? "1px solid rgba(165, 180, 252, 0.3)"
                                        : "1px solid transparent",
                                    whiteSpace: "nowrap",
                                    justifyContent: isSidebarCollapsed ? "center" : "flex-start",
                                    userSelect: "none",
                                }}
                                title={isSidebarCollapsed ? item.text : undefined}
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
                                <i
                                    className={`bi ${item.icon}`}
                                    style={{
                                        color: isActive(item.path)
                                            ? "#a5b4fc"
                                            : "rgba(255, 255, 255, 0.8)",
                                        fontSize: "1.2rem",
                                        minWidth: "24px",
                                        textAlign: "center",
                                        marginRight: isSidebarCollapsed ? 0 : "12px",
                                    }}
                                />
                                {!isSidebarCollapsed && (
                                    <span
                                        style={{
                                            color: isActive(item.path)
                                                ? "white"
                                                : "rgba(255, 255, 255, 0.8)",
                                            fontWeight: isActive(item.path) ? "500" : "400",
                                        }}
                                    >
                    {item.text}
                  </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Logout Button */}
                <div
                    className="mt-auto mb-3"
                    style={{ paddingBottom: isSidebarCollapsed ? "0" : "1rem" }}
                >
                    <button
                        onClick={handleLogout}
                        className="nav-link d-flex align-items-center w-100"
                        style={{
                            background: "rgba(244, 63, 94, 0.2)",
                            borderRadius: "8px",
                            border: "1px solid rgba(244, 63, 94, 0.3)",
                            padding: isSidebarCollapsed ? "10px 0" : "10px 15px",
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                            color: "rgba(255, 255, 255, 0.8)",
                            cursor: "pointer",
                            justifyContent: isSidebarCollapsed ? "center" : "flex-start",
                            whiteSpace: "nowrap",
                            userSelect: "none",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(244, 63, 94, 0.3)";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)";
                            e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                        }}
                        title={isSidebarCollapsed ? "Logout" : undefined}
                    >
                        <i
                            className="bi bi-power"
                            style={{
                                marginRight: isSidebarCollapsed ? 0 : "12px",
                                fontSize: "1.2rem",
                            }}
                        />
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </button>

                    {/* Footer */}
                    {!isSidebarCollapsed && (
                        <p
                            className="text-center mt-3 mb-0"
                            style={{
                                fontSize: "0.75rem",
                                color: "rgba(255, 255, 255, 0.5)",
                                userSelect: "none",
                            }}
                        >
                            &copy; 2025 Employee Management System. All Rights Reserved.
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div
                className="flex-grow-1"
                style={{
                    marginLeft: isSidebarCollapsed ? "60px" : "250px",
                    overflowY: "auto",
                    height: "100vh",
                    background: "#f8f9fa",
                    transition: "margin-left 0.3s ease",
                }}
            >
                <div
                    className="p-3 shadow text-center"
                    style={{
                        background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h4
                        style={{
                            color: "#334155",
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                            margin: 0,
                        }}
                    >
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
