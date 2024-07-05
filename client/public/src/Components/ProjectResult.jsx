import React from 'react'
import axios from 'axios';


const [projects, setProjects] = useState([]);

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

export const ProjectResult = () => {
  return (
    <div>
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
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td>{project.start_date}</td>
                            <td>{project.end_date}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(project.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
          </table>
    </div>
  )
}

export default ProjectResult;