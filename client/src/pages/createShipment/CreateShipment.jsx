import { useState } from 'react'
import './createShipment.css'
import { useNavigate } from 'react-router-dom'

function CreateShipment() {
    const [pickupLocation, setPickupLocation] = useState('')
    const [destination, setDestination] = useState('')
    const [weightInKg, setWeightInKg] = useState('')
    const [quote, setQuote] = useState(null)

    const navigate = useNavigate()

    const dummyDistance = 15 // Just within Nairobi
    const dummyTime = 30 // e.g. 30 minutes

    function calculateWeightFee(weight) {
        if (weight <= 2) return 80
        if (weight <= 10) return 150
        if (weight <= 30) return 250
        if (weight <= 60) return 400
        return 600 + (weight - 60) * 10
    }

    function calculateDistanceFee(distance) {
        if (distance <= 5) return distance * 20
        if (distance <= 20) return distance * 15
        if (distance <= 100) return distance * 10
        if (distance <= 200) return distance * 8
        return distance * 6
    }

    function calculatePrice(weight, distance) {
        const weightFee = calculateWeightFee(weight)
        const distanceFee = calculateDistanceFee(distance)
        return { weightFee, distanceFee, total: weightFee + distanceFee }
    }

    function handleSubmit(e) {
        e.preventDefault()
        const weight = parseFloat(weightInKg)
        const { weightFee, distanceFee, total } = calculatePrice(weight, dummyDistance)
        setQuote({
            pickupLocation,
            destination,
            weightInKg: weight,
            weightFee,
            distanceFee,
            totalCost: total,
            distance: dummyDistance,
            estimatedTime: dummyTime
        })

    }

    function handleConfirmOrder() {
        fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pickup_location: quote.pickupLocation,
                destination: quote.destination,
                weight_in_kg: quote.weightInKg,
                price_estimate: quote.totalCost
            })
        })
            .then(res => res.json())
            .then(data => {
                navigate('/dashboard')
            })
            .catch(err => {
                console.error('Error creating shipment:', err)
            })
    }

    return (
        <div className='create-shipment-page'>
            <div className='create-shipment-container'>
                <h1 className='create-shipment-title'>Create New Delivery Order</h1>
                <p className='create-shipment-description'>Fill in the details below to schedule a new package delivery.</p>
                <form className='create-shipment-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='pickup-location'>Pickup Location</label>
                        <input type='text' id='pickup-location' name='pickup_location' value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} placeholder='Enter pickup location' required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='destination'>Destination</label>
                        <input type='text' id='destination' name='destination' value={destination} onChange={e => setDestination(e.target.value)} placeholder='Enter destination' required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='weight_in_kg'>Weight (kg)</label>
                        <input type='number' id='weight_in_kg' name='weight_in_kg' value={weightInKg} onChange={e => setWeightInKg(e.target.value)} placeholder='Enter weight in kg' required min='0' />
                    </div>
                    <button type='submit' className='btn btn-primary'>Get Quote</button>
                </form>
            </div>

            {quote && <> <div className='review-quote-container'>
                <h2 className='review-quote-title'>Review Your Quote</h2>
                <p className='review-quote-description'>Confirm your shipment</p>
                <div className='review-quote-details'>
                    <h3>Delivery Quote</h3>
                    <div className='quote-item'>
                        <p className='quote-item-bold'>Distance</p>
                        <p className='quote-item-mute'>{quote.distance} km</p>
                    </div>
                    <div className='quote-item'>
                        <p className='quote-item-bold'>Estimated time</p>
                        <p className='quote-item-mute'>{quote.estimatedTime} mins</p>
                    </div>
                    <div className='quote-item'>
                        <p className='quote-item-bold'>Distance Fee</p>
                        <p className='quote-item-mute'>Ksh.{quote.distanceFee}</p>
                    </div>
                    <div className='quote-item'>
                        <p className='quote-item-bold'>Weight Fee</p>
                        <p className='quote-item-mute'>Ksh.{quote.weightFee}</p>
                    </div>
                    <div className="quote-item">
                        <p className="quote-item-bold">Total Cost</p>
                        <p className="quote-item-mute">Ksh.{quote.totalCost}</p>
                    </div>

                </div>
            </div>
                <div className='package-summary'>
                    <h2 className='package-summary-title'>Package Summary</h2>
                    <div className='package-summary-details'>
                        <p className='package-summary-item'>Pickup Location: <span className='package-summary-value'>{quote.pickupLocation}</span></p>
                        <p className='package-summary-item'>Destination: <span className='package-summary-value'>{quote.destination}</span></p>
                        <p className='package-summary-item'>Weight: <span className='package-summary-value'>{quote.weightInKg} kg</span></p>
                    </div>
                    <button onClick={handleConfirmOrder} className='confirm-package-btn'>Request Delivery</button>
                </div>
            </>}
        </div>
    )
}

export default CreateShipment
