import { useState, useEffect } from 'react';
import api from '../api.js';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', start_date: '', end_date: '' });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const result = await api.get('/auth/projects');
            setProjects(result.data.Result);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await api.post('/auth/add_project', formData);
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
                const result = await api.delete(`/auth/delete_project/${id}`);
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
        <div className="container my-4">
            <h2 className="text-center mb-4">Add Projects</h2>

            {/* Form wrapped in a responsive card */}
            <div className="card shadow-sm mb-5">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
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
                            <div className="col-6 col-md-3">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="submit" className="btn btn-success px-4">
                                Add Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Responsive Table Container */}
            <div className="table-responsive shadow-sm rounded">
                <table className="table table-striped table-hover mb-0">
                    <thead className="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col" className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-3">No projects found.</td>
                        </tr>
                    ) : (
                        projects.map((project, index) => (
                            <tr key={project._id || index}>
                                <th scope="row">{index + 1}</th>
                                <td>{project.name}</td>
                                <td>{new Date(project.start_date).toLocaleDateString()}</td>
                                <td>{new Date(project.end_date).toLocaleDateString()}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(project._id)}
                                        aria-label={`Delete project ${project.name}`}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Projects;
