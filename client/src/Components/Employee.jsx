import api from "../api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Employee = () => {
    const [employee, setEmployee] = useState([]);

    useEffect(() => {
        api
            .get("/auth/employee")
            .then((result) => {
                if (result.data.Status) {
                    setEmployee(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to Delete?");
        if (isConfirmed) {
            api
                .delete('/auth/delete_employee/' + id)
                .then((res) => {
                    if (res.data.Status) {
                        window.location.reload();
                    } else {
                        alert(res.data.Error);
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className="container px-3 px-md-5 mt-3">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row">
                <h3>Employee List</h3>
                <Link to="/dashboard/add_employee" className="btn btn-success mt-3 mt-md-0">
                    Add Employee
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Salary</th>
                        <th style={{ minWidth: "140px" }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employee.map((e) => (
                        <tr key={e._id}>
                            <td>{e.name}</td>
                            <td>
                                <img
                                    src={`${api.defaults.baseURL}/Images/` + e.image}
                                    className="employee_image"
                                />
                            </td>
                            <td>{e.email}</td>
                            <td>{e.address}</td>
                            <td>{e.salary}</td>
                            <td>
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <Link
                                        to={`/dashboard/edit_employee/${e._id}`}
                                        className="btn btn-outline-warning btn-sm flex-fill"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm flex-fill"
                                        onClick={() => handleDelete(e._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {employee.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No employees found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employee;
