import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddCategory = () => {
    const [category, setCategory] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/auth/add_category', { category })
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/category');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
            <div className="row w-100 justify-content-center">
                <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                    <div className="border rounded shadow-sm p-4 bg-white">
                        <h2 className="text-center mb-4">Add Category</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label"><strong>Category:</strong></label>
                                <input
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <button className="btn btn-success w-100">Add Category</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
