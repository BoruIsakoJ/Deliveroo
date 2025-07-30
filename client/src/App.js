import './App.css';
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Track from './pages/track/Track';
import { useEffect, useState } from 'react';
import UserNavbar from './components/userNavbar/UserNavbar';
import PrivateRoute from './components/PrivateRoute';
import Admin from './pages/admin/Admin';
import CreateShipment from './pages/createShipment/CreateShipment';
import Parcels from './pages/parcels/Parcels';
import OrderDetails from './pages/orderDetails/OrderDetails';
import Courier from './pages/courier/Courier';
import AllCouriers from './pages/allCouriers/AllCouriers';
import NewCourier from './pages/newCourier/NewCourier';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => console.error("Failed to fetch current user", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? <UserNavbar currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} setCurrentUser={currentUser}/> : <Navbar />}
        <div className='content'>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser}/>} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/track' element={<Track />} />
            <Route element={<PrivateRoute isLoggedIn={isLoggedIn}/>} >
              <Route path='/admin' element={<Admin currentUser={currentUser} />} />
              <Route path='/dashboard' element={<Dashboard currentUser={currentUser} />} />
              <Route path='/new' element={<CreateShipment/>}/>
              <Route path='/parcels' element={<Parcels currentUser={currentUser} />} />
              <Route path='/orders/:trackingNumber' element={<OrderDetails/>} />
              <Route path='/courier' element={<Courier/>} />
              <Route path='/couriers' element={<AllCouriers />} />
              <Route path='/new-courier' element={<NewCourier />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
