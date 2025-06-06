import { useState, useEffect } from 'react';
import api from '../api.js';

const EmployeeProjects = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const result = await api.get('/auth/employee_projects');
            if (result.data.Status) {
                setAssignments(result.data.Result);
            } else {
                console.error("Error fetching assignments:", result.data.Error);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Employee Projects</h2>
            {/* Bootstrap responsive wrapper */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Employee Name</th>
                        <th>Project Name</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No assignments found.
                            </td>
                        </tr>
                    ) : (
                        assignments.map((assignment, index) => (
                            <tr key={assignment.id || index}>
                                <td>{index + 1}</td>
                                <td>{assignment.employee_name}</td>
                                <td>{assignment.project_name}</td>
                                <td>{assignment.role}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeProjects;
