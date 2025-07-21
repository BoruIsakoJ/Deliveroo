import React from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import './navbar.css';
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <nav className='navbar'>
        <Link to='/' className='navbar-left'>
          <LocalShippingIcon className='company-logo' />
          <p>Deliveroo</p>
        </Link>

      <Link to="/" className='navbar-center'>
        <HomeFilledIcon className='home-logo' />
        <p>Home</p>
      </Link>
      <div className='navbar-right'>
        <Link to='/track'><button className='track-order-btn'>Track Order</button></Link>
        <Link to='/login'><button className='sign-in-btn'>Log In</button></Link>
        <Link to='/signup'><button className='get-started-btn'>Get Started</button></Link>
      </div>
    </nav>
  )
}

export default Navbar