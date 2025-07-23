import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/Navbar';
import UserNavBar from './components/userNavbar/UserNavbar';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Track from './pages/track/Track';
import Admin from './pages/admin/Admin';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const login = false
  return (
    <Router>
      <div className="App">
        {login?<UserNavBar />:<Navbar/>}
        <div className='content'>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/track' element={<Track/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
