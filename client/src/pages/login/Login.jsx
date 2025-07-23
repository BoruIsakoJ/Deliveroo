import './login.css';
import LoginIcon from '@mui/icons-material/Login';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({setIsLoggedIn,setCurrentUser}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  function loginUser(e) {
    e.preventDefault()
    setLoading(true);
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        'email': email,
        'password': password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        else if (data.isCourier) {
          navigate('/courier')
        }
        else {
          throw new Error('Login failed');
        }
      })
      .then(data => {
        console.log('Login successful', data)
        setIsLoggedIn(true)
        setCurrentUser(data)
        if (data.isAdmin) {
        navigate('/admin')}
        else {
          navigate('/dashboard')
        }
      })
      .catch(err => {
        console.log(err)
        setError('Invalid email or password.')
        setPassword("")
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  return (
    <div className='login'>
      <div className='container'>
        <div className='login-top'>
          <div className='welcome-msg'>
            <h1 className='welcome-msg-header'>Welcome Back</h1>
            <p className='welcome-msg-text'>Sign in to your account to continue</p>
          </div>
        </div>

        <div className='form-container'>
          <div className='form-container-text'>
            <p className='form-header'>Log In</p>
            <p className='form-text'>Enter your credentials to access your account</p>
          </div>

          <div className='form'>
            <form onSubmit={loginUser}>
              <div className='field-container'>
                <label htmlFor='email'>Email Address</label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='field-container'>
                <label htmlFor='password'>Password</label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className='login-page-btn' type='submit' disabled={loading}>
                {loading ? "Logging in..." :
                  <>
                    <LoginIcon className='login-page-icon' /> Log In
                  </>
                }
              </button>

              {error && <p className="error-msg">{error}</p>}

              <div className='dash-separator'></div>

              <p className='return-to-signup'>
                Don’t have an account?{' '}
                <Link className='link-to-login' to='/signup'>Create Account</Link>
              </p>
            </form>
          </div>
        </div>

        <Link className='back-to-home' to='/'>&larr; Back to Home</Link>
      </div>
    </div>
  );
}

export default Login;
