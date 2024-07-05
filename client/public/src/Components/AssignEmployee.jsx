import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ id: '', project_id: '', role: '' });



    useEffect(() => {
        fetchEmployees();
        fetchProjects();
    }, []);

    const fetchEmployees = async () => {
        try {
            const result = await axios.get('http://localhost:3000/auth/employee');
            setEmployees(result.data.Result);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const result = await axios.get('http://localhost:3000/auth/projects');
            setProjects(result.data.Result);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:3000/auth/assign_employee', formData);
            if (result.data.Status) {
                setFormData({ id: '', project_id: '', role: '' });
            } else {
                alert(result.data.Error);
            }
        } catch (error) {
            console.error("Error assigning employee:", error);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4 d-flex justify-content-center">Assign Employee to Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Employee</label>
                    <select
                        className="form-select"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        required
                    >
                        <option value=''>Select Employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Project</label>
                    <select
                        className="form-select"
                        value={formData.project_id}
                        onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                        required
                    >
                        <option value=''>Select Project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Assign Employee</button>
            </form>
        </div>
    );
};

export default AssignEmployee;
