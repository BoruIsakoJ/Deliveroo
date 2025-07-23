import './dashboard.css'
import TrolleyIcon from '@mui/icons-material/Trolley';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ currentUser }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('/orders/user')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders')
        return res.json()
      })
      .then(data => setOrders(data))
      .catch(err => console.error(err))
  }, [])

  const totalParcels = orders.length
  const inTransit = orders.filter(order => order.status === 'In Transit').length
  const delivered = orders.filter(order => order.status === 'Delivered').length
  const totalSpent = orders.filter(order => order.status === 'Delivered').reduce((sum, order) => sum + order.price_estimate, 0)

  function getUserName(name) {
    if (!name) return ''
    const parts = name.trim().split(' ')
    const first = parts[0]
    return first.charAt(0).toUpperCase() + first.slice(1)
  }


  return (
    <div className='dashboard-page'>
      <div className='dashboard-container'>
        <h1>Welcome back, {getUserName(currentUser.name)}!</h1>
        <p className='mute'>Manage your deliveries and track packages</p>
        <div className='orders-details-container'>
          <div className='total-orders'>
            <div className='total-orders-heading'>
              <h3>Total Parcels</h3>
              <TrolleyIcon className='total-orders-icon' />
            </div>
            <div className='total-orders-number'>{totalParcels}</div>
            <p className='total-orders-note'>All time shipments</p>
          </div>

          <div className='total-orders'>
            <div className='total-orders-heading'>
              <h3>In Transit</h3>
              <LocalShippingOutlinedIcon className='total-orders-icon' />
            </div>
            <div className='total-orders-number'>{inTransit}</div>
            <p className='total-orders-note'>Currently shipping</p>
          </div>

          <div className='total-orders'>
            <div className='total-orders-heading'>
              <h3>Delivered</h3>
              <CheckCircleOutlinedIcon className='total-orders-icon' />
            </div>
            <div className='total-orders-number'>{delivered}</div>
            <p className='total-orders-note'>Successfully delivered</p>
          </div>

          <div className='total-orders'>
            <div className='total-orders-heading'>
              <h3>Total Spent</h3>
              <PaymentsIcon className='total-orders-icon' />
            </div>
            <div className='total-orders-number'>Ksh. {totalSpent}</div>
            <p className='total-orders-note'>Shipping costs</p>
          </div>
        </div>
      </div>

      <div className='quick-actions-plus-recent-activity-container'>
        <div className="quick-actions-container">
          <h3 className='quick-actions-header'>Quick Actions</h3>
          <p className='quick-actions-text'>Common tasks to get you started</p>
          <div className='quick-actions'>
            <Link to='/new' className='quick-action'>
              <AddOutlinedIcon />
              <p className='quick-action-instruction'>Create Shipment</p>
              <p className='quick-action-mute'>Ship a new parcel</p>
            </Link >
            <Link to='/parcels' className='quick-action'>
              <LuggageOutlinedIcon />
              <p className='quick-action-instruction'>View All Parcels</p>
              <p className='quick-action-mute'>Manage shipments</p>
            </Link>
          </div>
        </div>

        <div className='recent_activity_container'>
          <h3>Recent Activity</h3>
          <p>Your latest shipments and updates</p>

          {orders.slice(0, 3).map(order => (
            <div className='order-details-container' key={order.id}>
              <div className='order-details-top'>
                <h4>{order.tracking_number}</h4>
                <div className='order-details-staus'>{order.status}</div>
              </div>
              <div className='order-details-bottom'>
                <div className='order-details-location'>
                  {order.pickup_location} &rarr; {order.destination}
                </div>
                <div className='order-details-price'>
                  Ksh. {order.price_estimate}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}

export default Dashboard