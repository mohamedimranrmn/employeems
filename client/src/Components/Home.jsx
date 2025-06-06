import axios from 'axios'
import { useEffect, useState } from 'react'


const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0)
  const [employeeTotal, setemployeeTotal] = useState(0)
  const [salaryTotal, setSalaryTotal] = useState(0)
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    axios.get('http://localhost:3000/auth/admin_records')
    .then(result => {
      if(result.data.Status) {
        setAdmins(result.data.Result)
      } else {
         alert(result.data.Error)
      }
    })
  }
  const adminCount = () => {
    axios.get('http://localhost:3000/auth/admin_count')
    .then(result => {
      if(result.data.Status) {
        setAdminTotal(result.data.Result[0].admin)
      }
    })
  }
  const employeeCount = () => {
    axios.get('http://localhost:3000/auth/employee_count')
    .then(result => {
      if(result.data.Status) {
        console.log(result.data);
        setemployeeTotal(result.data.Result[0].Employee_Count)
      }
    })
  }
  const salaryCount = () => {
    axios.get('http://localhost:3000/auth/salary_count')
    .then(result => {
      if(result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp)
      } else {
        alert(result.data.Error)
      }
    })
  }

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to Delete?");
    if(isConfirmed){
    axios.delete('http://localhost:3000/auth/delete_admin/'+id)
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
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Admin</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
        <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
        </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salary</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center mt-2'>
      <h3>List of Admins</h3>
      </div>
      <div className='mt-4 px-5 pt-3'>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Email Id</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              admins.map((admin,index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{admin.email}</td>
                  <td>
                    <button className='btn btn-danger' onClick={()=>handleDelete(admin._id)}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home