import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
    image: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
        .get("/auth/category")
        .then((result) => {
          if (result.data.Status) {
            setCategory(result.data.Result);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    formData.append("image", employee.image);
    formData.append("category_id", employee.category_id);

    api
        .post("/auth/add_employee", formData)
        .then((result) => {
          if (result.data.Status) {
            navigate("/dashboard/employee");
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
  };

  return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="p-4 border rounded bg-white shadow-sm">
              <h3 className="text-center mb-4">Add Employee</h3>
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label htmlFor="inputName" className="form-label">
                    Name
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="inputName"
                      placeholder="Enter Name"
                      onChange={(e) =>
                          setEmployee({ ...employee, name: e.target.value })
                      }
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                      type="email"
                      className="form-control"
                      id="inputEmail4"
                      placeholder="Enter Email"
                      autoComplete="off"
                      onChange={(e) =>
                          setEmployee({ ...employee, email: e.target.value })
                      }
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputPassword4" className="form-label">
                    Password
                  </label>
                  <input
                      type="password"
                      className="form-control"
                      id="inputPassword4"
                      placeholder="Enter Password"
                      onChange={(e) =>
                          setEmployee({ ...employee, password: e.target.value })
                      }
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputSalary" className="form-label">
                    Salary
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="inputSalary"
                      placeholder="Enter Salary"
                      autoComplete="off"
                      onChange={(e) =>
                          setEmployee({ ...employee, salary: e.target.value })
                      }
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputAddress" className="form-label">
                    Address
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      placeholder="1234 Main St"
                      autoComplete="off"
                      onChange={(e) =>
                          setEmployee({ ...employee, address: e.target.value })
                      }
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                      name="category"
                      id="category"
                      className="form-select"
                      value={employee.category_id}
                      onChange={(e) =>
                          setEmployee({ ...employee, category_id: e.target.value })
                      }
                  >
                    <option value="">Select Category</option>
                    {category.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="inputGroupFile01">
                    Select Image
                  </label>
                  <input
                      type="file"
                      className="form-control"
                      id="inputGroupFile01"
                      name="image"
                      onChange={(e) =>
                          setEmployee({ ...employee, image: e.target.files[0] })
                      }
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100">
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddEmployee;
