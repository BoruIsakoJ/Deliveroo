import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'


function Courier() {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [updatedStatus, setUpdatedStatus] = useState('')
    const [updatedLocation, setUpdatedLocation] = useState('')

    useEffect(() => {
        fetch(`/courier_orders/`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error('Error fetching courier orders:', err))
    }, []);

    const totalOrders = orders.length
    const pendingCount = orders.filter(order => order.status === 'Pending').length
    const pickedUpCount = orders.filter(order => order.status === 'Picked Up').length
    const inTransitCount = orders.filter(order => order.status === 'In Transit').length
    const deliveredCount = orders.filter(order => order.status === 'Delivered').length

    const columns = [
        { field: 'tracking_number', headerName: 'Tracking', width: 130 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => <span className={`status-badge ${params.value.toLowerCase().replace(/ /g, '-')}`}>{params.value}</span>
        },
        { field: 'customer_name', headerName: 'Customer' },
        { field: 'customer_phone_number', headerName: 'Customer Phone Number', width: 180 },
        {
            field: 'route',
            headerName: 'Route',
            width: 300,
            renderCell: (params) => (
                <div className='route'><span>{params.row.pickup_location}</span> <span>&rarr;</span> <span>{params.row.destination}</span></div>
            ),
        },
        {
            field: 'present_location',
            headerName: 'Current Location',
            width: 160,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 160,
            renderCell: (params) => (
                <div className='action-buttons'>
                    <button
                        className="edit-button"
                        data-bs-toggle="modal"
                        data-bs-target="#editCourierModal"
                        onClick={() => {
                            setSelectedOrder(params.row)
                            setUpdatedStatus(params.row.status)
                            setUpdatedLocation(params.row.present_location)
                        }}
                    >Update</button>
                    <button >
                        <Link className="view-button" to={`/orders/${params.row.tracking_number}`}>View</Link>
                    </button>
                </div>
            ),
        },
    ]

    function handleUpdate() {
        fetch(`/courier_orders/${selectedOrder.tracking_number}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                status: updatedStatus,
                present_location: updatedLocation,
            })
        })
            .then(res => res.json())
            .then(updated => {
                setOrders(prev => prev.map(o => o.tracking_number === updated.tracking_number ? { ...o, ...updated } : o))
                setSelectedOrder(null)
                setUpdatedLocation('')
                setUpdatedStatus('')
            })
            .catch(err => console.error('Error updating:', err))
    }

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
                    <h1>Courier Dashboard</h1>
                    <p className='mute'>Track and update your assigned deliveries</p>
                    <div className='orders-details-container'>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Total Orders</h3>
                                <Inventory2OutlinedIcon className='total-orders-icon' />
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
                                <h3>Picked Up</h3>
                                <CachedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{pickedUpCount}</div>
                            <p className='total-orders-note'>On the way to destination</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>In Transit</h3>
                                <LocalShippingOutlinedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{inTransitCount}</div>
                            <p className='total-orders-note'>Currently being delivered</p>
                        </div>

                        <div className='total-orders'>
                            <div className='total-orders-heading'>
                                <h3>Delivered</h3>
                                <CheckCircleOutlinedIcon className='total-orders-icon' />
                            </div>
                            <div className='total-orders-number'>{deliveredCount}</div>
                            <p className='total-orders-note'>Successfully delivered</p>
                        </div>
                    </div>
                </div>

                <div className='parcel-container'>
                    <div className='parcel-heading'>
                        <h3>My Parcels</h3>
                        <p>Only parcels assigned to you</p>
                    </div>
                    <div className='data-grid-wrapper'>
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            getRowId={(row) => row.id}
                            pageSizeOptions={[5, 10]}
                            disableRowSelectionOnClick
                            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                            sx={{ border: 0 }}
                        />
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editCourierModal" tabIndex="-1" aria-labelledby="editLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Status & Location</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {selectedOrder && (
                                <>
                                    <p><strong>Tracking:</strong> {selectedOrder.tracking_number}</p>
                                    <label className="form-label">New Status:</label>
                                    <select className="form-select" value={updatedStatus} onChange={e => setUpdatedStatus(e.target.value)}>
                                        <option>Confirmed</option>
                                        <option>Picked Up</option>
                                        <option>In Transit</option>
                                        <option>Delivered</option>
                                    </select>
                                    <label className="form-label mt-3">Current Location:</label>
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
                                    </Autocomplete>                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Courier;
