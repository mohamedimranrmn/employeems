import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api.js'
import 'bootstrap-icons/font/bootstrap-icons.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchEmployeeDetail();
    fetchEmployeeProjects();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    try {
      const result = await api.get(`/employee/detail/${id}`);
      if (result.data.Status) {
        setEmployee(result.data.Result);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const fetchEmployeeProjects = async () => {
    try {
      const result = await api.get(`/auth/assignments/employee/${id}`);
      if (result.data.Status) {
        setProjects(result.data.Result);
      }
    } catch (error) {
      console.error("Error fetching employee projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get('/employee/employee_logout');
      localStorage.removeItem("valid");
      navigate('/employee_login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
    );
  }

  if (!employee) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="alert alert-danger">Employee not found</div>
        </div>
    );
  }

  return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-lg overflow-hidden">
              {/* Header Section */}
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Employee Dashboard</h3>
                <button
                    className="btn btn-light btn-sm"
                    onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>

              {/* Profile Overview */}
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Profile Sidebar */}
                  <div className="col-md-4 bg-light p-4 d-flex flex-column align-items-center">
                    <div className="position-relative mb-3">
                      <img
                          src={`http://localhost:3000/Images/${employee.image}`}
                          alt={employee.name}
                          className="img-fluid rounded-circle border border-4 border-white shadow"
                          style={{
                            width: '180px',
                            height: '180px',
                            objectFit: 'cover'
                          }}
                      />
                      <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2 border border-3 border-white"></span>
                    </div>

                    <h4 className="text-center mb-1">{employee.name}</h4>
                    <div className="w-100 text-center text-muted mb-3">
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted mt-5">Email:</span>
                        <span className="fw-bold mt-5" >{employee.email}</span>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted mt-lg-1">Salary:</span>
                        <span className="fw-bold mt-lg-1">${employee.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="col-md-8 p-4">
                    {/* Navigation Tabs */}
                    <ul className="nav nav-tabs mb-4">
                      <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                          <i className="bi bi-person me-1"></i> Profile
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => setActiveTab('projects')}
                        >
                          <i className="bi bi-folder me-1"></i> Projects
                        </button>
                      </li>
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content">
                      {/* Profile Tab */}
                      {activeTab === 'profile' && (
                          <div className="tab-pane fade show active">
                            <h5 className="mb-3">Personal Information</h5>
                            <div className="row mb-4">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label text-muted">Full Name</label>
                                  <div className="form-control bg-light">{employee.name}</div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label text-muted">Email</label>
                                  <div className="form-control bg-light">{employee.email}</div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="form-label text-muted">Address</label>
                                  <div className="form-control bg-light">{employee.address || 'N/A'}</div>
                                </div>
                              </div>
                            </div>

                            <h5 className="mb-3">Employment Details</h5>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label text-muted">Department</label>
                                  <div className="form-control bg-light">{employee.category_id?.name || 'N/A'}</div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label text-muted">Salary</label>
                                  <div className="form-control bg-light">${employee.salary}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                      )}

                      {/* Projects Tab */}
                      {activeTab === 'projects' && (
                          <div className="tab-pane fade show active">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="mb-0">Assigned Projects</h5>
                              <span className="badge bg-primary">
                            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                          </span>
                            </div>

                            {projects.length > 0 ? (
                                <div className="table-responsive">
                                  <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                    <tr>
                                      <th>Project</th>
                                      <th>Role</th>
                                      <th>Timeline</th>
                                      <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {projects.map((assignment) => {
                                      const startDate = formatDate(assignment.project_id?.start_date);
                                      const endDate = formatDate(assignment.project_id?.end_date);
                                      const isActive = new Date(assignment.project_id?.end_date) > new Date();

                                      return (
                                          <tr key={assignment._id}>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                                  <i className="bi bi-folder text-primary"></i>
                                                </div>
                                                <div>
                                                  <h6 className="mb-0">{assignment.project_id?.name || 'N/A'}</h6>
                                                  <small className="text-muted">ID: {assignment.project_id?._id || 'N/A'}</small>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <span className="badge bg-info">{assignment.role || 'N/A'}</span>
                                            </td>
                                            <td>
                                              <small>
                                                {startDate} - {endDate}
                                              </small>
                                            </td>
                                            <td>
                                        <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
                                          {isActive ? 'Active' : 'Completed'}
                                        </span>
                                            </td>
                                          </tr>
                                      );
                                    })}
                                    </tbody>
                                  </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                  <i className="bi bi-folder-x display-5 text-muted mb-3"></i>
                                  <h5>No Projects Assigned</h5>
                                  <p className="text-muted">This employee hasn't been assigned to any projects yet.</p>
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EmployeeDetail;