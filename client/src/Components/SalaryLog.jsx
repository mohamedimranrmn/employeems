import { useState, useEffect } from 'react';
import api from '../api.js';

const SalaryLog = () => {
    const [salaryLogs, setSalaryLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchSalaryLogs();
    }, []);

    const fetchSalaryLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await api.get('/auth/salary');

            if (result.data.Status) {
                setSalaryLogs(result.data.Result || []);
            } else {
                throw new Error(result.data.Error || 'Failed to fetch salary logs');
            }
        } catch (err) {
            console.error('Fetch salary logs error:', err);
            setError(err.response?.data?.Error || err.message || 'Failed to fetch salary logs');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount) => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount || 0);
        } catch (error) {
            return `$${amount || 0}`;
        }
    };

    const getSalaryChangeType = (oldSalary, newSalary) => {
        const oldSal = parseFloat(oldSalary) || 0;
        const newSal = parseFloat(newSalary) || 0;

        if (newSal > oldSal) {
            return { type: 'increase', class: 'text-success', icon: '↑' };
        } else if (newSal < oldSal) {
            return { type: 'decrease', class: 'text-danger', icon: '↓' };
        }
        return { type: 'no-change', class: 'text-muted', icon: '→' };
    };

    const getEmployeeName = (log) => {
        // Check multiple possible fields for employee name
        if (log.employee_id && log.employee_id.name) {
            return log.employee_id.name;
        }
        if (log.name) {
            return log.name;
        }
        if (log.employeeName) {
            return log.employeeName;
        }
        return 'Unknown Employee';
    };

    const getEmployeeEmail = (log) => {
        if (log.employee_id && log.employee_id.email) {
            return log.employee_id.email;
        }
        return '';
    };

    const filteredLogs = salaryLogs.filter(log => {
        const employeeName = getEmployeeName(log).toLowerCase();
        const searchTerm = filter.toLowerCase();
        return employeeName.includes(searchTerm);
    });

    const handleRefresh = () => {
        fetchSalaryLogs();
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading salary logs...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Employee Salary Change Log</h3>
                <button
                    className="btn btn-outline-primary"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    <i className="fas fa-refresh me-1"></i>
                    Refresh
                </button>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <div>
                        {error}
                        <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={handleRefresh}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Search by employee name..."
                        className="form-control"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-6 d-flex align-items-center">
                    <small className="text-muted">
                        Showing {filteredLogs.length} of {salaryLogs.length} records
                    </small>
                </div>
            </div>

            {!error && (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th>Employee</th>
                            <th>Email</th>
                            <th>Previous Salary</th>
                            <th>New Salary</th>
                            <th>Change</th>
                            <th>Amount Change</th>
                            <th>Date</th>
                            <th>Reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, index) => {
                                const { type, class: changeClass, icon } = getSalaryChangeType(log.old_salary, log.new_salary);
                                const employeeName = getEmployeeName(log);
                                const employeeEmail = getEmployeeEmail(log);
                                const oldSalary = parseFloat(log.old_salary) || 0;
                                const newSalary = parseFloat(log.new_salary) || 0;
                                const changeAmount = newSalary - oldSalary;

                                return (
                                    <tr key={log._id || index}>
                                        <td>
                                            <strong>{employeeName}</strong>
                                        </td>
                                        <td>
                                            <small className="text-muted">{employeeEmail}</small>
                                        </td>
                                        <td>{formatCurrency(oldSalary)}</td>
                                        <td>{formatCurrency(newSalary)}</td>
                                        <td className={changeClass}>
                                            <strong>{icon} {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}</strong>
                                        </td>
                                        <td className={changeClass}>
                                            <strong>
                                                {changeAmount > 0 ? '+' : ''}{formatCurrency(changeAmount)}
                                            </strong>
                                        </td>
                                        <td>
                                            {formatDate(log.change_date || log.createdAt || log.updatedAt)}
                                        </td>
                                        <td>
                                                <span className="badge bg-secondary">
                                                    {log.reason || 'Salary Update'}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    <div className="text-muted">
                                        <i className="fas fa-search fa-2x mb-2 d-block"></i>
                                        {filter ? 'No records found matching your search' : 'No salary change records found'}
                                    </div>
                                    {filter && (
                                        <button
                                            className="btn btn-sm btn-outline-secondary mt-2"
                                            onClick={() => setFilter('')}
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && salaryLogs.length === 0 && (
                <div className="alert alert-info text-center">
                    <i className="fas fa-info-circle me-2"></i>
                    No salary change records have been created yet. Salary changes will appear here when employees' salaries are updated.
                </div>
            )}
        </div>
    );
};

export default SalaryLog;