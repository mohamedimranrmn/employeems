import { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', start_date: '', end_date: '' });

    useEffect(() => {
        fetchProjects();
    }, []);

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
            const result = await axios.post('http://localhost:3000/auth/add_project', formData);
            if (result.data.Status) {
                fetchProjects();
                setFormData({ name: '', start_date: '', end_date: '' });
            } else {
                alert(result.data.Error);
            }
        } catch (error) {
            console.error("Error adding project:", error);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this project?");
        if (isConfirmed) {
            try {
                const result = await axios.delete(`http://localhost:3000/auth/delete_project/${id}`);
                if (result.data.Status) {
                    fetchProjects();
                } else {
                    alert(result.data.Error);
                }
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    return (
        <div className="container">
            <h2 className="my-4 d-flex justify-content-center">Add Projects</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Add Project</button>
            </form>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project,index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{project.name}</td>
                            <td>{project.start_date}</td>
                            <td>{project.end_date}</td>
                            <td>
                                <button className='btn btn-danger ' onClick={() => handleDelete(project.id)}><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Projects;
