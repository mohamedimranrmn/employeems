import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Category = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        api.get('/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            if (window.confirm("Warning: Deleting this category will also delete associated employees. Continue?")) {
                api.delete(`/auth/delete_category/${id}`)
                    .then(res => {
                        if (res.data.Status) {
                            setCategory(prev => prev.filter(c => c._id !== id)); // Optimistic UI update
                        } else {
                            alert(res.data.Error);
                        }
                    })
                    .catch(err => console.log(err));
            }
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                <h3 className="text-center text-md-start mb-3 mb-md-0">Category List</h3>
                <Link to="/dashboard/add_category" className="btn btn-success">
                    Add Category
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                    <thead className="table-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Category Name</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {category.length === 0 ? (
                        <tr>
                            <td colSpan="3">No categories available.</td>
                        </tr>
                    ) : (
                        category.map((c, index) => (
                            <tr key={c._id}>
                                <td>{index + 1}</td>
                                <td>{c.name}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(c._id)}
                                    >
                                        Delete
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

export default Category;
