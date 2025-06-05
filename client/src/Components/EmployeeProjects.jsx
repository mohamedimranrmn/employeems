import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeProjects = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const result = await axios.get('http://localhost:3000/auth/employee_projects');
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
        <div className="container">
            <h2 className="my-4 d-flex justify-content-center">Employee Projects</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee Name</th>
                        <th>Project Name</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment,index) => (
                        <tr key={assignment.id}>
                            <td>{index+1}</td>
                            <td>{assignment.employee_name}</td>
                            <td>{assignment.project_name}</td>
                            <td>{assignment.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeProjects;
