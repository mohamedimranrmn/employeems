import api from "../api.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/verify')
        .then(result => {
          if (result.data.Status) {
            if (result.data.role === "admin") {
              navigate('/dashboard');
            } else {
              navigate('/employee_detail/' + result.data.id);
            }
          }
        })
        .catch(err => console.log(err));
  }, []);

  return (
      <div className="d-flex justify-content-center align-items-center vh-100 loginPage px-3">
        <div className="p-4 rounded border bg-white shadow-sm"
             style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Login As</h2>
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
            <button
                type="button"
                className="btn btn-primary flex-fill"
                onClick={() => navigate('/employee_login')}
            >
              Employee
            </button>
            <button
                type="button"
                className="btn btn-success flex-fill"
                onClick={() => navigate('/adminlogin')}
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
  );
};

export default Start;
