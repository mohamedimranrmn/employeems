import { useState } from 'react'
import './style.css'
import api from '../api.js'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    api.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const result = await api.post('/auth/adminlogin', values)
            if(result.data.loginStatus) {
                localStorage.setItem("valid", true)
                navigate('/dashboard')
            } else {
                setError(result.data.Error)
            }
        } catch(err) {
            console.error(err)
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-4 rounded w-25 border loginForm'>
                {error && (
                    <div className='alert alert-danger text-center mb-3'>
                        {error}
                    </div>
                )}
                <h2 className="text-center mb-4">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input
                            type="email"
                            name='email'
                            id="email"
                            autoComplete='off'
                            placeholder='Enter Email'
                            value={values.email}
                            onChange={(e) => setValues({...values, email: e.target.value})}
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input
                            type="password"
                            name='password'
                            id="password"
                            placeholder='Enter Password'
                            value={values.password}
                            onChange={(e) => setValues({...values, password: e.target.value})}
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <button
                        className='btn btn-primary w-100 rounded-0 mb-3'
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                    <button
                        className='btn btn-primary w-100 rounded-0 mb-3'>
                        <Link to="/employee_login" className="text-white text-decoration-none">
                            Go to employee Login
                        </Link>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login