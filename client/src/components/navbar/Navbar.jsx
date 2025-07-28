import React from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import './navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className='custom-navbar'>
      <div className='custom-navbar-left'>
        <Link to='/' className='custom-brand'>
          <LocalShippingIcon className='custom-logo' />
          <span>Deliveroo</span>
        </Link>
      </div>

      <div className='custom-navbar-center'>
        <Link to="/" className='custom-nav-link'>
          <HomeFilledIcon className='custom-icon' />
          <span>Home</span>
        </Link>
      </div>

      <div className='custom-navbar-right'>
        <Link to='/track'>
          <button className='custom-btn outline-btn'>Track Order</button>
        </Link>
        <Link to='/login'>
          <button className='custom-btn ghost-btn'>Log In</button>
        </Link>
        <Link to='/signup'>
          <button className='custom-btn filled-btn'>Get Started</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
