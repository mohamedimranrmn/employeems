import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
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
    if(isConfirmed){
    axios.delete('http://localhost:3000/auth/delete_employee/'+id)
    .then(res => {
        if(res.data.Status) {
            window.location.reload()
        } else {
            alert(res.data.Error)
        }
    }).catch((err)=>console.log(err));
  }
}

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center mb-4">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    className="employee_image"
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e._id}
                    className="btn btn-outline-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => handleDelete(e._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;