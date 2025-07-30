import './signup.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  function signUp(e) {
    e.preventDefault()
    setLoading(true)
    fetch('/register', {
      method: 'POST',
      body: JSON.stringify({
        'name': name,
        'email': email,
        'phone_number': phone_number,
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
        else {
          throw new Error(`HTTP status ${res.status}`)
        }
      })
      .then(data => {
        console.log(data)
        navigate('/login')
      })
      .catch(error => {
        console.log(error)
        setError('Registration failed. Email may already exist.')
      })
      .finally(() => {
        setLoading(false)
      })

  }


  return (
    <div className='signup'>
      <div className='container'>
        <div className="signup-top">
          <div className="welcome-msg">
            <h1 className='welcome-msg-header'>Join Deliveroo</h1>
            <p className='welcome-msg-text'>Create your account to get started</p>
          </div>
        </div>

        <div className="form-container">
          <div className='form-container-text'>
            <p className='form-header'>Sign Up</p>
            <p className='form-text'>Fill in your details to create your account</p>
          </div>

          <div className="form">
            <form onSubmit={signUp}>
              <div className='field-container'>
                <label htmlFor='name'>Full Name</label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className='field-container'>
                <label htmlFor='email'>Email Address</label>
                <input id='email'
                  name='email' type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='field-container'>
                <label htmlFor='phone_number'>Phone Number</label>
                <input
                  id='phone_number'
                  name='phone_number'
                  type='text'
                  placeholder='Enter your phone number'
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className='field-container'>
                <label htmlFor='password'>Password</label>
                <input id='password'
                  name='password'
                  type='password'
                  placeholder='Create a password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className='signup-page-btn' disabled={loading}>
                {loading ? 'Signing up...' :
                  <>
                    <PersonAddIcon className='signup-page-icon' /> Create Account
                  </>
                }
              </button>

              {error && <p className="error-msg">{error}</p>}


              <div className='dash-separator'></div>

              <p className='return-to-login'>
                Already have an account? <Link className='link-to-login' to='/login'>Log In</Link>
              </p>
            </form>
          </div>
        </div>
        <Link className='back-to-home' to='/'>&larr; Back to Home</Link>
      </div>
    </div>
  );
}

export default Signup;
