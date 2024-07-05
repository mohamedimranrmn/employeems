import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState({
    id: " ",
    employee_name: " ",
    email: " ",
    salary: " ",
    employee_image: " ",
    category_name: " ",
    project_name: " ",
    role: " ",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/employee/detail/" + id)
      .then((result) => {
        setEmployee(result.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid", false);
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="p-1 d-flex justify-content-center shadow">
        <h4>Employee Management System</h4>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td className="text-center" colSpan="2">
                    <img
                      src={`http://localhost:3000/Images/${employee.employee_image}`}
                      className="emp_det_image"
                      alt="Employee"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Name:</th>
                  <td>{employee.employee_name}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{employee.email}</td>
                </tr>
                {employee.project_name &&(
                <tr>
                    <th>Project:</th>
                    <td>{employee.project_name}</td>
                </tr>
                )}
                {employee.role && (
                <tr>
                    <th>Role:</th>
                    <td>{employee.role}</td>
                </tr>
                )}
                <tr>
                  <th>Salary:</th>
                  <td>${employee.salary}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-center mt-3">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
