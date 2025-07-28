import './userNavbar.css';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { Link } from 'react-router-dom';

function UserNavbar({ currentUser }) {
  function handleLogout() {
    fetch('/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          console.log("User logged out successfully");
          window.location.reload();
        } else {
          console.error("Failed to log out");
        }
      })
      .catch(err => console.error("Error during logout", err));
  }

  function getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    const first = parts[0][0].toUpperCase();
    const second = parts[1] ? parts[1][0].toUpperCase() : '';
    return first + second;
  }

  function getDashboardPath(user) {
    if (!user) return '/login';
    if (user.isAdmin) return '/admin';
    if (user.isCourier) return '/courier';
    return '/dashboard';
  }


  return (
    <nav className='custom-navbar'>
      <div className='custom-navbar-left'>
        <Link to='/' className='custom-brand'>
          <LocalShippingIcon className='custom-logo' />
          <span>Deliveroo</span>
        </Link>
      </div>

      <div className='custom-navbar-center'>
        <Link to={getDashboardPath(currentUser)} className='custom-nav-link'>
          <BarChartIcon className='custom-icon' />
          <span>Dashboard</span>
        </Link>

        <Link to='/parcels' className='custom-nav-link'>
          <LocalPostOfficeIcon className='custom-icon' />
          <span>Parcels</span>
        </Link>
      </div>

      <div className='custom-navbar-right'>
        <div className='user-profile'>
          <button className='profile-btn'>{getInitials(currentUser.name)}</button>
        </div>
        <button onClick={handleLogout} className='custom-btn ghost-btn'>Log Out</button>
      </div>
    </nav>
  );
}

export default UserNavbar;
