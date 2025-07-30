import { useEffect, useState } from 'react';
import './allCouriers.css';
import { DataGrid } from '@mui/x-data-grid';

function AllCouriers() {
    const [couriers, setCouriers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/couriers', { credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => {
                setCouriers(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);


    function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this courier?")) return;

        fetch(`/couriers/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete courier');
                }
                return res.json();
            })
            .then((data) => {

                setCouriers((prevCouriers) => prevCouriers.filter(courier => courier.id !== id));
            })
            .catch((error) => {
                console.error('Delete error:', error);
                alert("Failed to delete courier");
            });
    };


    const columns = [
        { field: 'name', headerName: 'Courier Name', width: 130 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone_number', headerName: 'Phone Number', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div className='actions-cell'>
                    <button className='courier-delete-button' onClick={() => handleDelete(params.row.id)}>Delete</button>
                </div>
            ),
        }

    ];

    return (
        <div className='parcels-page'>
            <h2>Active Couriers</h2>
            <p className='mute'>Manage your couriers</p>

            <div className='user-data-grid'>
                {loading ? (
                    <p>Loading couriers...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>Error loading couriers: {error.message}</p>
                ) : (
                    <DataGrid
                        rows={couriers}
                        columns={columns}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.id}
                        initialState={{
                            pagination: { paginationModel: { page: 0, pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10]}
                        sx={{
                            border: 0,
                            height: 400,
                            width: '100%',
                            maxWidth: 700,
                        }}
                    />
                )}
            </div>
        </div >
    );
}

export default AllCouriers