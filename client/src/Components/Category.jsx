import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(()=> {
        axios.get('http://localhost:3000/auth/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to Delete?");
        if(isConfirmed){
            const isConfirmed1 = window.confirm("The Employees enrolled in this category will also be deleted!!")
                if(isConfirmed1){
                    axios.delete('http://localhost:3000/auth/delete_category/'+id)
                    .then(res => {
                        if(res.data.Status) {
                            window.location.reload()
                        } else {
                            alert(res.data.Error)
                        }
                    }).catch((err)=>console.log(err));
        }
      }
    }

  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'>
            <h3>Category List</h3>
        </div>
        <Link to="/dashboard/add_category" className='btn btn-success mt-4'>Add Category</Link>
        <div className='mt-3'>
            <table className='table table-striped  mt-3'>
                    <tr>
                        <th>Sno</th>
                        <th>Name</th>
                        <th>Delete</th>
                    </tr>
                <tbody>
                    {
                        category.map((c,index) => (
                            <tr key={index} className='mt-20'>
                                <td>{index+1}</td>
                                <td>{c.name}</td>
                                <td>
                                    <button className='btn btn-danger' onClick={()=>{handleDelete(c._id)}}>Delete</button>
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

export default Category