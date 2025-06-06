import api from '../api.js';
import { useEffect, useState } from "react";

const ProjectResult = () => {
    const [projects, setProjects] = useState([]);

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
        <div className="container my-4 px-2">
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project._id}>
                            <td className="text-truncate" style={{ maxWidth: "150px" }}>{project._id}</td>
                            <td>{project.name}</td>
                            <td>{new Date(project.start_date).toLocaleDateString()}</td>
                            <td>{new Date(project.end_date).toLocaleDateString()}</td>
                            <td className="text-center">
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectResult;
