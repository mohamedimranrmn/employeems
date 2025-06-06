import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";

const EditEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        salary: "",
        address: "",
        category_id: "",
    });
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("Employee ID is missing in URL.");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories
                const categoriesResult = await api.get('/auth/category');
                if (categoriesResult.data.Status) {
                    setCategory(categoriesResult.data.Result);
                } else {
                    throw new Error(categoriesResult.data.Error || "Failed to fetch categories");
                }

                // Fetch employee
                const employeeResult = await api.get(`/auth/employee/${id}`);
                if (employeeResult.data.Status && employeeResult.data.Result.length > 0) {
                    const emp = employeeResult.data.Result[0];
                    setEmployee({
                        name: emp.name || "",
                        email: emp.email || "",
                        salary: emp.salary ? emp.salary.toString() : "",
                        address: emp.address || "",
                        category_id: emp.category_id ? emp.category_id._id : "",
                    });
                } else {
                    throw new Error(employeeResult.data.Error || "Employee not found");
                }
            } catch (err) {
                setError(err.message || "Failed to fetch employee or category data.");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!employee.name.trim()) {
            setError("Name is required");
            setLoading(false);
            return;
        }

        if (!employee.email.trim()) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        if (!employee.salary || parseFloat(employee.salary) < 0) {
            setError("Valid salary is required");
            setLoading(false);
            return;
        }

        if (!employee.category_id) {
            setError("Category is required");
            setLoading(false);
            return;
        }

        try {
            const result = await api.put(`/auth/edit_employee/${id}`, {
                ...employee,
                salary: parseFloat(employee.salary)
            });

            if (result.data.Status) {
                setSuccess("Employee updated successfully!");

                // Show success message and redirect after a delay
                setTimeout(() => {
                    navigate('/dashboard/employee');
                }, 1500);
            } else {
                throw new Error(result.data.Error || "Failed to update employee");
            }
        } catch (err) {
            setError(err.response?.data?.Error || err.message || "Failed to update employee");
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !employee.name) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-3">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 p-3 border rounded shadow-sm bg-white">
                    <h3 className="text-center mb-4">Edit Employee</h3>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="g-3">
                        <div className="mb-3">
                            <label htmlFor="inputName" className="form-label">
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-0"
                                id="inputName"
                                placeholder="Enter Name"
                                value={employee.name}
                                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputEmail4" className="form-label">
                                Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control rounded-0"
                                id="inputEmail4"
                                placeholder="Enter Email"
                                autoComplete="off"
                                value={employee.email}
                                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputSalary" className="form-label">
                                Salary <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                className="form-control rounded-0"
                                id="inputSalary"
                                placeholder="Enter Salary"
                                autoComplete="off"
                                value={employee.salary}
                                onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
                                min="0"
                                step="0.01"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputAddress" className="form-label">
                                Address <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-0"
                                id="inputAddress"
                                placeholder="1234 Main St"
                                autoComplete="off"
                                value={employee.address}
                                onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="form-label">
                                Category <span className="text-danger">*</span>
                            </label>
                            <select
                                name="category"
                                id="category"
                                className="form-select"
                                value={employee.category_id}
                                onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
                                required
                                disabled={loading}
                            >
                                <option value="">Select Category</option>
                                {category.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Employee'
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/dashboard/employee')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;
