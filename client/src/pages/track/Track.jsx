import { useState } from 'react';
import './track.css';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import LocationPinIcon from '@mui/icons-material/LocationPin';

function Track() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setOrder(null)
    fetch(`/orders/${trackingNumber}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Order not found');
        }
        return res.json();
      })
      .then(data => {
        const transformed = { ...data, progress: data.tracking_orders }
        setOrder(transformed)
      })
      .catch(() => {
        setError('Order not found')
      })
  }



  return (
    <div className='track-container'>
      <h1 className='track-header'>Track Your Order</h1>
      <p className='track-text'>Enter your tracking ID to see real-time updates</p>

      <div className='package-tracker-form-container'>
        <h2 className='package-tracker-header'>
          <SearchIcon className='package-tracker-header-icon' />
          Package Tracking
        </h2>
        <p className='package-tracker-instructions'>
          Enter your delivery Order ID to track your package
        </p>

        <form className='tracker-form-container' onSubmit={handleSubmit}>
          <input
            className='tracker-form'
            type="text"
            name="tracking_number"
            placeholder='e.g., DEL001'
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            required
          />
          <button className='track-btn' type='submit'>
            <SearchIcon className='track-btn-icon' />
            Track Order
          </button>
        </form>
        {error && <p className='error'>{error}</p>}

      </div>

      {order && (
        <div className='order-details'>
          <div className="order-details">
            <div className="order-details-header">
              <h3>
                <LocalShippingIcon className="order-icon" />
                Order #{order.tracking_number}
              </h3>
              <span className="status">{order.status}</span>
            </div>

            <div className="info-grid">
              <div className="info-box">
                <h4 className="info-title">Delivery Details</h4>
                <div className="info-line"><span className="label">Sender:</span> {order.user.name}</div>
                <div className="info-line"><ArrowCircleLeftIcon className="info-icon" /> {order.pickup_location}</div>
                <div className="info-line"><ArrowCircleRightIcon className="info-icon" /> {order.destination}</div>
                <div className="info-line"><LocationPinIcon className="info-icon" /> {order.present_location}</div>
                <div className="info-line"><AccessTimeIcon className="info-icon" /> {order.created_at}</div>
              </div>

              <div className="info-box">
                <h4 className="info-title">Courier Info</h4>
                <div className="info-line"><span className="label">Name:</span> {order.courier.name}</div>
                <div className="info-line">
                  <span className="label">Phone:</span>
                  <a href={`tel:${order.courier.phone_number}`} className="courier-phone">{order.courier.phone_number}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <h3>Delivery Progress</h3>
            <div className="timeline">
              {order.tracking_orders.map((step, index) => (
                <div key={index} className={`timeline-step ${index === order.tracking_orders.length - 1 ? 'active-step' : ''}`}>
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-status">{step.status}</div>
                    <div className="timeline-meta">
                      <span className="timeline-time">{new Date(step.timestamp).toLocaleString()}</span> — {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

      )}
    </div>
  );
}



export default Track;
