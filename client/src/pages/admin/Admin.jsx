import './admin.css'
import TrolleyIcon from '@mui/icons-material/Trolley';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import CachedIcon from '@mui/icons-material/Cached';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';

import { Link } from 'react-router-dom';

function Admin() {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        fetch('/orders')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched orders:', data)
                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setOrders(sortedData)
            })
            .catch(err => console.error('Error fetching orders:', err))
    }, [])


    const totalOrders = orders.length
    const pendingCount = orders.filter(order => order.status === 'Pending').length
    const confirmedCount = orders.filter(order => order.status === 'Confirmed').length
    const pickedUpCount = orders.filter(order => order.status === 'Picked Up').length
    const inTransitCount = orders.filter(order => order.status === 'In Transit').length
    const deliveredCount = orders.filter(order => order.status === 'Delivered').length
    const revenue = orders.filter(order => order.status === 'Delivered').reduce((sum, order) => sum + (order.price_estimate), 0)

    const columns = [
        { field: 'tracking_number', headerName: 'Tracking', width: 130 },
        {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (params) => (
                <span className={`status-badge ${params.value.toLowerCase()}`}>
                    {params.value}
                </span>
            ),
        },
        { field: 'customer_name', headerName: 'Customer' },
        { field: 'customer_phone_number', headerName: 'Customer Phone Number', width: 180 },
        { field: 'courier_name', headerName: 'Courier' },
        { field: 'courier_phone_number', headerName: 'Courier Phone Number', width: 180 },
        {
            field: 'route',
            headerName: 'Route',
            width: 200,
            renderCell: (params) => (
                <div className='route'><span>{params.row.pickup_location}</span> <span>&rarr;</span> <span>{params.row.destination}</span></div>
            ),
        },
        {
            field: 'present_location',
            headerName: 'Current Location',
            width: 160,
            renderCell: (params) => {
                return <span>{params.row.present_location || "N/A"}</span>
            },
        },
        { field: 'price_estimate', headerName: 'Cost' },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 180,
            renderCell: (params) => {
                const date = params.row.created_at ? new Date(params.row.created_at) : null;
                return <span>{date ? date.toLocaleString('en-KE') : 'N/A'}</span>;
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => (
                <div className="action-buttons">
                    <button
                        className="edit-button"
                        data-bs-toggle="modal"
                        data-bs-target="#editOrderModal"
                        onClick={() => {
                            setSelectedOrder(params.row);
                            setUpdatedStatus(params.row.status);
                        }}
                    >
                        Edit
                    </button>
                    <button >
                        <Link className="view-button" to={`/orders/${params.row.tracking_number}`}>View</Link>
                    </button>

                </div>
            ),
        }

    ]

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [updatedStatus, setUpdatedStatus] = useState('')
    const [updatedLocation, setUpdatedLocation] = useState('')

    function handleUpdateStatus() {

        const updatedOrder = {
            status: updatedStatus,
            present_location: updatedLocation,
        };

        if (selectedCourierId) {
            updatedOrder.courier_id = selectedCourierId;
        }

        fetch(`/orders/${selectedOrder.tracking_number}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatedOrder),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server returned ${res.status}`);
                }
                return res.json()
            })
            .then(updatedOrder => {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.tracking_number === updatedOrder.tracking_number
                            ? { ...order, ...updatedOrder }  
                            : order
                    )
                )
                setSelectedOrder(null)
                setUpdatedStatus('')
                setUpdatedLocation('')
                setSelectedCourierId('')
            })
            .catch(err => console.error('Error updating order status:', err))
    }

    const [couriers, setCouriers] = useState([])
    const [selectedCourierId, setSelectedCourierId] = useState('')

    useEffect(() => {
        fetch('/couriers')
            .then(res => res.json())
            .then(data => setCouriers(data))
            .catch(err => console.error('Error fetching couriers:', err))
    }, [])

    const autocompleteRef = useRef(null);
    const locationInputRef = useRef(null);


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    if (!isLoaded) return <p>Loading Google Maps...</p>


    return (
        <>
            <div className='dashboard-page'>
                <div className='dashboard-container'>
                    <h1>Admin Dashboard</h1>
                    <p className='mute'>Manage your deliveries and track packages</p>
                    <div className='orders-details-container'>
                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Total Orders</h3>
                                <TrolleyIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{totalOrders}</div>
                            <p className='total-orders-note'>All shipments</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Pending</h3>
                                <ErrorOutlineOutlinedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{pendingCount}</div>
                            <p className='total-orders-note'>Need attention</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Confirmed</h3>
                                <RecommendOutlinedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{confirmedCount}</div>
                            <p className='total-orders-note'>Confirmed orders</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Picked Up</h3>
                                <CachedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{pickedUpCount}</div>
                            <p className='total-orders-note'>Picked up by courier</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>In Transit</h3>
                                <LocalShippingOutlinedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{inTransitCount}</div>
                            <p className='total-orders-note'>Active deliveries</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Delivered</h3>
                                <CheckCircleOutlinedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{deliveredCount}</div>
                            <p className='total-orders-note'>Successful deliveries</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Revenue</h3>
                                <PaymentsIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{revenue}</div>
                            <p className='total-orders-note'>From deliveries</p>
                        </div>
                    </div>

                    <div className="quick-actions-wrapper">
                        <div className="quick-actions-container">
                            <h3 className="quick-actions-header">Quick Actions</h3>
                            <p className="quick-actions-text">Common tasks to get you started</p>
                            <div className="quick-actions">
                                <Link to="/new-courier" className="quick-action">
                                    <AddOutlinedIcon />
                                    <p className="quick-action-instruction">Create Courier</p>
                                    <p className="quick-action-mute">Create a new courier</p>
                                </Link>
                                <Link to="/couriers" className="quick-action">
                                    <LuggageOutlinedIcon />
                                    <p className="quick-action-instruction">View All Couriers</p>
                                    <p className="quick-action-mute">Manage couriers</p>
                                </Link>
                            </div>
                        </div>
                    </div>



                </div>
                <div className="parcel-container">
                    <div className="parcel-controls">
                        <div className="parcel-heading">
                            <h3>All Parcels</h3>
                            <p>Manage and track all shipments in the system</p>
                        </div>
                    </div>

                    <div className="data-grid-wrapper">
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick
                            initialState={{
                                pagination: { paginationModel: { page: 0, pageSize: 10 } }
                            }}
                            pageSizeOptions={[5, 10]}
                            sx={{ border: 0 }}
                        />
                    </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="editOrderModal"
                tabIndex="-1"
                aria-labelledby="editOrderModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editOrderModalLabel">Edit Order Status</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedOrder && (
                                <>
                                    <p><strong>Tracking:</strong> {selectedOrder.tracking_number}</p>
                                    <label htmlFor="status" className="form-label">Change Status:</label>
                                    <select
                                        id="status"
                                        className="form-select"
                                        value={updatedStatus}
                                        onChange={(e) => setUpdatedStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Picked Up">Picked Up</option>
                                        <option value="In Transit">In Transit</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <label htmlFor="location" className="form-label mt-3">Update Present Location:</label>
                                    <Autocomplete
                                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                        onPlaceChanged={() => {
                                            const place = autocompleteRef.current?.getPlace();
                                            if (place && place.name) {
                                                setUpdatedLocation(place.name);
                                                if (locationInputRef.current) {
                                                    locationInputRef.current.value = place.name;
                                                }
                                            }
                                        }}

                                    >
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter location"
                                            ref={locationInputRef}
                                            value={updatedLocation}
                                            onChange={(e) => setUpdatedLocation(e.target.value)}
                                        />
                                    </Autocomplete>


                                    <label htmlFor="courier" className="form-label mt-3">Assign Courier:</label>
                                    <select
                                        id="courier"
                                        className="form-select"
                                        value={selectedCourierId}
                                        onChange={(e) => setSelectedCourierId(e.target.value)}
                                    >
                                        <option value="">-- Select Courier --</option>
                                        {couriers.map(courier => (
                                            <option key={courier.id} value={courier.id}>
                                                {courier.name} ({courier.phone_number})
                                            </option>
                                        ))}
                                    </select>

                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setUpdatedStatus('');
                                    setUpdatedLocation('');
                                    setSelectedCourierId('');
                                }}
                            >Cancel</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleUpdateStatus}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Admin