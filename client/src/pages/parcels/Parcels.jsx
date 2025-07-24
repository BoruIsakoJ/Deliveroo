import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './parcels.css';
import { Link } from 'react-router-dom';


function Parcels() {
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newDestination, setNewDestination] = useState('');

  useEffect(() => {
    fetch('/user_orders/')
      .then(res => res.json())
      .then(data => {
        setUserOrders(data)
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
      body: JSON.stringify({ destination: newDestination }),
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
      width: 180,
      renderCell: (params) => (
        <div className='route'>
          <span>{params.row.pickup_location}</span> <span>&rarr;</span> <span>{params.row.destination}</span>
        </div>
      ),
    },
    {
      field: 'present_location',
      headerName: 'Current Location',
      width: 160,
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
        const isCancellable = ['Pending', 'Confirmed'].includes(status)

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

  return (
    <div className='parcels-page'>
      <h2>My Parcels</h2>
      <p className='mute'>Track all your delivery orders</p>

      <div className='user-data-grid'>
        <DataGrid
          rows={userOrders}
          columns={columns}
          getRowId={(row) => row.id}
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
                <input
                  type="text"
                  className="form-control"
                  id="newDestination"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
