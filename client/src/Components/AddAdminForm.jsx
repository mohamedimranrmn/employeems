import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAdminForm = () => {
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
        email: admin.email, 
        password: admin.password 
    };
    axios.post("http://localhost:3000/auth/add_admin",formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/");
        } 
        else {
            alert(result.data.error);
        }
      })
      .catch((err) => {
        console.error('Request Error:', err);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-center">
              <h1 className="card-title">Add Admin</h1>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={admin.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={admin.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success btn-block mt-3">
                  Add Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdminForm;
