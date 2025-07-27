import { useRef, useState } from 'react'
import './createShipment.css'
import { useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'

function CreateShipment() {
    const [pickupLocation, setPickupLocation] = useState('')
    const [destination, setDestination] = useState('')
    const [weightInKg, setWeightInKg] = useState('')
    const [quote, setQuote] = useState(null)
    const [pickupCoords, setPickupCoords] = useState(null)
    const [destinationCoords, setDestinationCoords] = useState(null)
    const [directions, setDirections] = useState(null)


    const navigate = useNavigate()


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
    const pickupAutoRef = useRef(null)
    const destinationAutoRef = useRef(null)
    const pickupInputRef = useRef(null)
    const destinationInputRef = useRef(null)

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    function handleSubmit(e) {
        e.preventDefault()
        const weight = parseFloat(weightInKg)

        const pickupPlace = pickupAutoRef.current?.getPlace()
        const destinationPlace = destinationAutoRef.current?.getPlace()

        if (!pickupPlace || !destinationPlace) {
            alert("Please select valid locations.")
            return
        }

        const origin = pickupPlace.geometry.location
        const destinationLoc = destinationPlace.geometry.location

        const directionsService = new window.google.maps.DirectionsService()

        directionsService.route(
            {
                origin,
                destination: destinationLoc,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    const distanceInMeters = result.routes[0].legs[0].distance.value
                    const durationInSeconds = result.routes[0].legs[0].duration.value

                    const distanceInKm = (distanceInMeters / 1000).toFixed(1)
                    const estimatedTime = Math.ceil(durationInSeconds / 60)

                    const { weightFee, distanceFee, total } = calculatePrice(weight, distanceInKm)
                    setPickupCoords({
                        lat: origin.lat(),
                        lng: origin.lng(),
                    })

                    setDestinationCoords({
                        lat: destinationLoc.lat(),
                        lng: destinationLoc.lng(),
                    })

                    setDirections(result)

                    setQuote({
                        pickupLocation,
                        destination,
                        weightInKg: weight,
                        weightFee,
                        distanceFee,
                        totalCost: total,
                        distance: distanceInKm,
                        estimatedTime,
                    })


                } else {
                    console.error('Directions request failed due to ', status)
                    alert('Unable to calculate route. Please try again.')
                }
            }
        )
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

    if (!isLoaded) return <p>Loading Google Maps...</p>

    return (
        <div className='create-shipment-page'>
            <div className='create-shipment-container'>
                <h1 className='create-shipment-title'>Create New Delivery Order</h1>
                <p className='create-shipment-description'>Fill in the details below to schedule a new package delivery.</p>
                <form className='create-shipment-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='pickup-location'>Pickup Location</label>
                        <Autocomplete className='form-group'
                            onLoad={(autocomplete) => (pickupAutoRef.current = autocomplete)}
                            onPlaceChanged={() => {
                                const place = pickupAutoRef.current?.getPlace()
                                if (place && place.name) {
                                    setPickupLocation(place.name)
                                }
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter pickup location"
                                required
                                ref={pickupInputRef}
                            />
                        </Autocomplete>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='destination'>Destination</label>
                        <Autocomplete className='form-group'
                            onLoad={(autocomplete) => (destinationAutoRef.current = autocomplete)}
                            onPlaceChanged={() => {
                                const place = destinationAutoRef.current?.getPlace()
                                if (place && place.name) {
                                    setDestination(place.name)
                                }
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter destination"
                                required
                                ref={destinationInputRef}
                            />
                        </Autocomplete>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='weight_in_kg'>Weight (kg)</label>
                        <input type='number' id='weight_in_kg' name='weight_in_kg' value={weightInKg} onChange={e => setWeightInKg(e.target.value)} placeholder='Enter weight in kg' required min='0' />
                    </div>
                    <button type='submit' className='btn btn-primary'>Get Quote</button>
                </form>

                {pickupCoords && destinationCoords && (
                    <div style={{ height: '400px', marginTop: '2rem' }}>
                        <GoogleMap
                            mapContainerStyle={{ height: '100%', width: '100%' }}
                            center={pickupCoords}
                            zoom={13}
                        >
                            <Marker position={pickupCoords} label="Pickup" />
                            <Marker position={destinationCoords} label="Destination" />
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    </div>
                )}

            </div >

            {
                quote && <> <div className='review-quote-container'>
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
                </>
            }
        </div >
    )
}
export default CreateShipment;