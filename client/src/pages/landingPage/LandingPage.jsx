import "./landingPage.css"
import { Link } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MoveToInboxOutlinedIcon from '@mui/icons-material/MoveToInboxOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

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
                    <Link to="/signup"><button className="orange-btn" type="button">Get Started &rarr;</button></Link>
                    <Link to="/track"><button className="blue-btn" type="button">Track Package</button></Link>
                </div>
            </div>

            <div className="why-choose-us">
                <h2 className="why-choose-us-title">Why Choose Deliveroo</h2>
                <p className="why-choose-us-description">We provide world-class courier services with modern technology and reliable partnerships.</p>

                <div className="why-choose-us-cards">
                    <div className="why-choose-us-card">
                        <div className="why-choose-us-icon one">
                            <LocationOnIcon />
                        </div>
                        <h3>Real-Time Tracking</h3>
                        <p>Track your packages in real-time with GPS monitoring and live status updates.</p>
                    </div>

                    <div className="why-choose-us-card">
                        <div className="why-choose-us-icon two">
                            <AccessTimeIcon />
                        </div>
                        <h3>Fast Delivery</h3>
                        <p>Get your packages delivered quickly and efficiently with our optimized logistics.</p>
                    </div>

                    <div className="why-choose-us-card">
                        <div className="why-choose-us-icon three">
                            <ShieldOutlinedIcon />
                        </div>
                        <h3>Secure & Insured</h3>
                        <p>All packages are insured and secured with the latest technology to ensure safe delivery.</p>
                    </div>

                    <div className="why-choose-us-card ">
                        <div className="why-choose-us-icon four">
                            <LocalShippingOutlinedIcon />
                        </div>
                        <h3>Wide Coverage</h3>
                        <p>Nationwide delivery network covering both urban and rural areas.</p>
                    </div>

                    <div className="why-choose-us-card ">
                        <div className="why-choose-us-icon five">
                            <PeopleOutlinedIcon />
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Our support team is available 24/7 to assist you with any inquiries or issues.</p>
                    </div>

                    <div className="why-choose-us-card ">
                        <div className="why-choose-us-icon six">
                            <StarOutlineIcon />
                        </div>
                        <h3>Rated #1</h3>
                        <p>Deliveroo is rated #1 for customer satisfaction in the courier industry.</p>
                    </div>

                </div>

                <div className="why-choose-us-how-it-works">
                    <h3 className="why-choose-us-title">How It works</h3>
                    <p className="why-choose-us-description">Simple steps to send your packages anywhere in the country.</p>
                    <div className="how-to-order-container">
                        <div className="order-steps">
                            <div className="how-to-order-icon one">
                                <AccountCircleOutlinedIcon className="order-icon"/>
                            </div>
                            <p className="order-steps-header">1. Create Account</p>
                            <p className="order-steps-description">Create your account by providing your name, email, phone number, and setting a password.</p>

                        </div>



                        <div className="order-steps">
                            <div className="how-to-order-icon two">
                                <MoveToInboxOutlinedIcon className="order-icon"/>
                            </div>
                            <p className="order-steps-header">2. Create Order</p>
                            <p className="order-steps-description">Fill in the details of your package, including the pickup location, destination address and package weight.</p>

                        </div>

                        <div className="order-steps">
                            <div className="how-to-order-icon three">
                                <LocalShippingOutlinedIcon className="order-icon"/>
                            </div>
                            <p className="order-steps-header">3. Pickup & Transport</p>
                            <p className="order-steps-description">Our courier picks up your package and begins the journey with real-time tracking updates.</p>

                        </div>

                        <div className="order-steps">
                            <div className="how-to-order-icon four">
                                <AssignmentTurnedInOutlinedIcon className="order-icon"/>
                            </div>
                            <p className="order-steps-header">4. Safe Delivery</p>
                            <p className="order-steps-description">Package delivered safely to the destination with confirmation and delivery proof</p>

                        </div>
                    </div>
                </div>

            </div>

            <div className="ready-to-send">
                <h2 className="ready-to-send-title">Ready to Send Your Package?</h2>
                <p className="ready-to-send-description">Join thousands of satisfied customers who trust Deliveroo for their courier needs.</p>
                <Link to="/signup"><button className="ready-to-send-btn" type="button">Start Shipping Now &rarr;</button></Link>
                <Link to="/login"><button className="ready-to-send-btn last" type="button">Login</button></Link>

            </div>
        </div>
    )
}

export default LandingPage