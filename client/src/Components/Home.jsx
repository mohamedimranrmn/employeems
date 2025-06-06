import api from '../api.js';
import { useEffect, useState } from 'react';

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    api.get('/auth/admin_records')
        .then(result => {
          if (result.data.Status) {
            setAdmins(result.data.Result);
          } else {
            alert(result.data.Error);
          }
        });
  };

  const adminCount = () => {
    api.get('/auth/admin_count')
        .then(result => {
          if (result.data.Status) {
            setAdminTotal(result.data.Result[0].admin);
          }
        });
  };

  const employeeCount = () => {
    api.get('/auth/employee_count')
        .then(result => {
          if (result.data.Status) {
            setEmployeeTotal(result.data.Result[0].Employee_Count);
          }
        });
  };

  const salaryCount = () => {
    api.get('/auth/salary_count')
        .then(result => {
          if (result.data.Status) {
            setSalaryTotal(result.data.Result[0].salaryOFEmp);
          } else {
            alert(result.data.Error);
          }
        });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to Delete?");
    if (isConfirmed) {
      api.delete('/auth/delete_admin/' + id)
          .then(res => {
            if (res.data.Status) {
              window.location.reload();
            } else {
              alert(res.data.Error);
            }
          }).catch((err) => console.log(err));
    }
  };

  return (
      <div className="container-fluid px-3 py-4">
        {/* Summary Cards */}
        <div className="row justify-content-around g-3">
          <div className="col-12 col-md-4">
            <div className="p-3 border shadow-sm h-100">
              <div className="text-center pb-2">
                <h4>Admin</h4>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>{adminTotal}</h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 border shadow-sm h-100">
              <div className="text-center pb-2">
                <h4>Employee</h4>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>{employeeTotal}</h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 border shadow-sm h-100">
              <div className="text-center pb-2">
                <h4>Salary</h4>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>${salaryTotal}</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Admin List Title */}
        <div className="d-flex justify-content-center mt-4">
          <h3>List of Admins</h3>
        </div>

        {/* Admin List Table */}
        <div className="mt-3 px-0 px-md-5">
          <div className="table-responsive">
            <table className="table table-bordered table-striped mb-0">
              <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Email Id</th>
                <th>Delete</th>
              </tr>
              </thead>
              <tbody>
              {admins.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">No admins found.</td>
                  </tr>
              ) : (
                  admins.map((admin, index) => (
                      <tr key={admin._id || index}>
                        <td>{index + 1}</td>
                        <td>{admin.email}</td>
                        <td>
                          <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(admin._id)}
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
      </div>
  );
};

export default Home;
