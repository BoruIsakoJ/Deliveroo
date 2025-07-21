import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className='content'>
          <Routes>
            <Route path='/' element={<LandingPage />} />
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
