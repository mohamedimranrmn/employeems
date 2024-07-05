import React from 'react'
import axios from 'axios';
import { useState,useEffect } from 'react';

export const salaryLog = () => {
    const [salary, setSalary] = useState([])

    useEffect(()=> {
        axios.get('http://localhost:3000/auth/salary')
        .then(result => {
            if(result.data.Status) {
                setSalary(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    },[])


  return (
    <div className="container mt-3">
      <h2 className="mb-4 d-flex justify-content-center">Salary Log</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Old salary</th>
            <th>New salary</th>
            <th>Change Date</th>
          </tr>
        </thead>
        <tbody>
          {salary.map((s,index) => (
            <tr key={index}>
              <td>{s.name}</td>
              <td>{s.old_salary}</td>
              <td>{s.new_salary}</td>
              <td>{s.change_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default salaryLog
