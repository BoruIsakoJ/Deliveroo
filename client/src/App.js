import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/Navbar';
import UserNavBar from './components/userNavbar/UserNavbar';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';

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
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
