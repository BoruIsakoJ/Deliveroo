import "./landingPage.css"
import {Link} from 'react-router-dom'

function LandingPage() {
    return (
        <div className="hero-page">
            <div className="hero-title">
                <p className="hero-title-white">Fast & Reliable</p>
                <p className="hero-title-orange">Courier Services</p>
                <div className="hero-title-text">
                    <p>Send packages anywhere with real-time tracking,competitive pricing and guaranteed delivery times.</p>
                </div>
                <div className="hero-title-buttons">
                    <Link  to="/signup"><button className="orange-btn" type="button">Get Started &rarr;</button></Link>
                    <Link to=""><button className="blue-btn" type="button">Track Package</button></Link>
                </div>
            </div>

            <div>

            </div>

        </div>
    )
}

export default LandingPage