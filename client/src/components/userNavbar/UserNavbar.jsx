import './userNavbar.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { Link } from 'react-router-dom';

function UserNavbar() {

  const isAdmin = false; 
  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-left'>
        <LocalShippingIcon className='company-logo' />
        <p>Deliveroo</p>
      </Link>

      <div className='navbar-center'>
      <Link to={isAdmin?'/admin':'/dashboard'} className='navbar-center'>
        <div>
          <BarChartIcon className='dashboard-logo' />
          <p>Dashboard</p>
        </div>
      </Link>

      <Link to='/track' className='navbar-center'>
        <div>
          <LocalPostOfficeIcon className='dashboard-logo' />
          <p>Parcels</p>
        </div>
      </Link>
      </div>
      <div className='navbar-right'>
        <div className='user-profile'>
          <button>{'BI'}</button>
        </div>
        <button className='sign-in-btn'>Log Out</button>
      </div>
    </nav>
  )
}

export default UserNavbar