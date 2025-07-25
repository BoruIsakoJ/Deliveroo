import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../track/track.css';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationPinIcon from '@mui/icons-material/LocationPin';

function OrderDetails() {
    const { trackingNumber } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/orders/${trackingNumber}`)
            .then(res => {
                if (!res.ok) throw new Error('Order not found');
                return res.json();
            })
            .then(data => {
                setOrder({ ...data, progress: data.tracking_orders });
            })
            .catch(() => {
                setError('Order not found');
            });
    }, [trackingNumber]);

    if (error) return <p className="error">{error}</p>;

    return (
        <div className="track-container">
            {order ? (
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
                                <div className="info-line"><span className="label">Name:</span> {order.courier?.name || 'Courier to be assigned!'}</div>
                                <div className="info-line">
                                    <span className="label">Phone:</span>
                                    <a href={`tel:${order.courier?.phone_number}`} className="courier-phone">{order.courier?.phone_number || 'N/A'}</a>
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
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default OrderDetails;
