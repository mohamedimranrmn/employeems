import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AddAdminForm = () => {
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/auth/add_admin", {
      email: admin.email,
      password: admin.password,
    })
        .then((result) => {
          if (result.data.Status) {
            navigate("/dashboard/");
          } else {
            alert(result.data.error);
          }
        })
        .catch((err) => {
          console.error("Request Error:", err);
          alert("Something went wrong while adding admin.");
        });
  };

  return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-custom-dark text-dark text-center">
                <h2 className="card-title mb-0">Add Admin</h2>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={admin.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter admin email"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={admin.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter a secure password"
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">
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
