import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './parcels.css';
import { Link } from 'react-router-dom';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useRef } from 'react';



function Parcels() {
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newDestination, setNewDestination] = useState('');
  const [pricePreview, setPricePreview] = useState(null)


  useEffect(() => {
    fetch('/user_orders/')
      .then(res => res.json())
      .then(data => {
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUserOrders(sortedData)
      })
      .catch(err => console.error('Error fetching user orders:', err))
  }, []);

  function openEdit(order) {
    if (['Delivered', 'Cancelled'].includes(order.status)) return
    setSelectedOrder(order)
    setNewDestination(order.destination)
  }

  function handleSaveChanges() {
    if (!selectedOrder) return

    fetch(`/user_orders/${selectedOrder.tracking_number}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        destination: newDestination,
        price_estimate: pricePreview?.total ?? selectedOrder.price_estimate
      })
      ,
    })
      .then(res => res.json())
      .then(updated => {
        setUserOrders(prev =>
          prev.map(order =>
            order.tracking_number === updated.tracking_number ? updated : order
          )
        )
        setSelectedOrder(null)
        setNewDestination('')
        setPricePreview(null)
      })
      .catch(err => console.error('Failed to update order', err))
  }

  function handleCancelOrder(order) {
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      alert('You can only cancel orders that are Pending or Confirmed.')
      return
    }

    if (!window.confirm('Are you sure you want to cancel this order?')) return

    fetch(`/user_orders/${order.tracking_number}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Cancelled' }),
    })
      .then(res => res.json())
      .then(updated => {
        setUserOrders(prev =>
          prev.map(o =>
            o.tracking_number === updated.tracking_number ? updated : o
          )
        )
      })
      .catch(err => console.error('Failed to cancel order', err))
  }

  const columns = [
    { field: 'tracking_number', headerName: 'Tracking', width: 130 },
    {
      field: 'route',
      headerName: 'Route',
      width: 350,
      renderCell: (params) => (
        <div className='route'>
          <span>{params.row.pickup_location}</span> <span>&rarr;</span> <span>{params.row.destination}</span>
        </div>
      ),
    },
    {
      field: 'present_location',
      headerName: 'Current Location',
      width: 250,
      renderCell: (params) => <span>{params.row.present_location || 'N/A'}</span>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
    },
    {
      field: 'price_estimate',
      headerName: 'Cost (Ksh)',
      width: 120,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 180,
      renderCell: (params) => {
        const date = params.row.created_at ? new Date(params.row.created_at) : null
        return <span>{date ? date.toLocaleString('en-KE') : 'N/A'}</span>
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => {
        const status = params.row.status;
        const isEditable = !['Delivered', 'Cancelled'].includes(status)
        const isCancellable = !['Delivered', 'Cancelled'].includes(status)

        return (
          <div className="action-buttons">
            <button
              className={`edit-button ${!isEditable ? 'disabled' : ''}`}
              data-bs-toggle="modal"
              data-bs-target="#editOrderModal"
              onClick={() => isEditable && openEdit(params.row)}
              disabled={!isEditable}
            >
              Edit
            </button>
            <button >
              <Link className="view-button" to={`/orders/${params.row.tracking_number}`}>View</Link>
            </button>

            <button
              className={`cancel-button ${!isCancellable ? 'disabled' : ''}`}
              onClick={() => isCancellable && handleCancelOrder(params.row)}
              disabled={!isCancellable}
            >
              Cancel
            </button>
          </div>
        );
      },
    }

  ];
  

  const autocompleteRef = useRef(null);
  const destinationInputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });


  if (!isLoaded) return <p>Loading Google Maps...</p>

  function calculateWeightFee(weight) {
    if (weight <= 2) return 80
    if (weight <= 10) return 150
    if (weight <= 30) return 250
    if (weight <= 60) return 400
    return 600 + (weight - 60) * 10
  }


  function calculateDistanceFee(distance) {
    if (distance <= 5) return Math.round(distance * 20)
    if (distance <= 20) return Math.round(distance * 15)
    if (distance <= 100) return Math.round(distance * 10)
    if (distance <= 200) return Math.round(distance * 8)
    return Math.round(distance * 6)
  }


  function calculatePrice(weight, distance) {
    const weightFee = calculateWeightFee(weight)
    const distanceFee = calculateDistanceFee(distance)
    return { weightFee, distanceFee, total: weightFee + distanceFee }
  }



  return (
    <div className='parcels-page'>
      <h2>My Parcels</h2>
      <p className='mute'>Track all your delivery orders</p>

      <div className='user-data-grid'>
        <DataGrid
          rows={userOrders}
          columns={columns}
          getRowId={(row) => row.tracking_number}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </div>
      <div
        className="modal fade"
        id="editOrderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Destination</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p><strong>Tracking Number:</strong> {selectedOrder?.tracking_number}</p>
              <div className="mb-3">
                <label htmlFor="newDestination" className="form-label">New Destination</label>
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current?.getPlace();
                    if (place && place.name) {
                      setNewDestination(place.name);
                      if (destinationInputRef.current) {
                        destinationInputRef.current.value = place.name;
                      }

                      const destinationLoc = place.geometry?.location;

                      const geocoder = new window.google.maps.Geocoder();
                      geocoder.geocode({ address: selectedOrder.pickup_location }, (results, status) => {
                        if (status === 'OK') {
                          const originLoc = results[0].geometry.location;

                          const directionsService = new window.google.maps.DirectionsService();
                          directionsService.route({
                            origin: originLoc,
                            destination: destinationLoc,
                            travelMode: window.google.maps.TravelMode.DRIVING
                          }, (result, status) => {
                            if (status === window.google.maps.DirectionsStatus.OK) {
                              const distanceInKm = result.routes[0].legs[0].distance.value / 1000;
                              const { weightFee, distanceFee, total } = calculatePrice(
                                selectedOrder.weight_in_kg,
                                distanceInKm
                              );

                              setPricePreview({
                                distance: distanceInKm.toFixed(1),
                                weightFee,
                                distanceFee,
                                total
                              });
                            } else {
                              console.error('Directions request failed due to', status);
                              setPricePreview(null);
                            }
                          });
                        } else {
                          console.error('Geocoding pickup failed:', status);
                          setPricePreview(null);
                        }
                      });
                    }
                  }}

                >
                  <input
                    type="text"
                    className="form-control"
                    id="newDestination"
                    ref={destinationInputRef}
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="Search new destination..."
                  />
                </Autocomplete>

                {pricePreview && (
                  <div className="quote-preview mt-3 p-3 border rounded bg-light">
                    <h6>New Estimated Quote</h6>
                    <p>Distance: {pricePreview.distance} km</p>
                    <p>Distance Fee: Ksh. {pricePreview.distanceFee}</p>
                    <p>Weight Fee: Ksh. {pricePreview.weightFee}</p>
                    <p><strong>Total: Ksh. {pricePreview.total}</strong></p>
                  </div>
                )}


              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setPricePreview(null)}>Close</button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parcels;
