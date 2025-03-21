// // src/components/TripForm.js
// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const TripForm = ({ onTripPlanned }) => {
//     const [formData, setFormData] = useState({
//         currentLocation: '',
//         pickupLocation: '',
//         dropoffLocation: '',
//         currentCycleUsed: ''
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://127.0.0.1:8000/api/plan-trip/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     current_location: formData.currentLocation,
//                     pickup_location: formData.pickupLocation,
//                     dropoff_location: formData.dropoffLocation,
//                     current_cycle_used: parseFloat(formData.currentCycleUsed) || 0
//                 })
//             });
//             if (!response.ok) throw new Error('API request failed');
//             const data = await response.json();
//             onTripPlanned(data); // Pass route and log sheets to parent
//         } catch (error) {
//             console.error('Error submitting trip:', error);
//             alert('Failed to plan trip. Check console for details.');
//         }
//     };

//     return (
//         <div className="mt-4">
//             <h3>Plan Your Trip</h3>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label htmlFor="currentLocation" className="form-label">Current Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         id="currentLocation"
//                         name="currentLocation"
//                         value={formData.currentLocation}
//                         onChange={handleChange}
//                         placeholder="e.g., New York, NY"
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="pickupLocation" className="form-label">Pickup Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         id="pickupLocation"
//                         name="pickupLocation"
//                         value={formData.pickupLocation}
//                         onChange={handleChange}
//                         placeholder="e.g., Philadelphia, PA"
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="dropoffLocation" className="form-label">Drop-off Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         id="dropoffLocation"
//                         name="dropoffLocation"
//                         value={formData.dropoffLocation}
//                         onChange={handleChange}
//                         placeholder="e.g., Washington, DC"
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="currentCycleUsed" className="form-label">Current Cycle Used (hours)</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         id="currentCycleUsed"
//                         name="currentCycleUsed"
//                         value={formData.currentCycleUsed}
//                         onChange={handleChange}
//                         min="0"
//                         max="70"
//                         step="0.5"
//                         placeholder="e.g., 0"
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Plan Trip</button>
//             </form>
//         </div>
//     );
// };

// export default TripForm;


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TripForm = ({ onTripPlanned }) => {
    const [formData, setFormData] = useState({
        current_location: '',
        pickup_location: '',
        dropoff_location: '',
        current_cycle_used: 0,
        driverName: '',
        licenseNumber: '',
        carrierName: '',
        homeTerminal: '',
        truckNumber: '',
        trailerNumber: '',
        licensePlates: '',
        remarks: '',
        shippingDocs: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/plan-trip/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_location: formData.current_location,
                    pickup_location: formData.pickup_location,
                    dropoff_location: formData.dropoff_location,
                    current_cycle_used: parseInt(formData.current_cycle_used)
                })
            });
            const data = await response.json();
            if (response.ok) {
                onTripPlanned({ ...data, driverInfo: {
                    name: formData.driverName,
                    licenseNumber: formData.licenseNumber,
                    carrierName: formData.carrierName,
                    homeTerminal: formData.homeTerminal,
                    truckNumber: formData.truckNumber,
                    trailerNumber: formData.trailerNumber,
                    licensePlates: formData.licensePlates,
                    remarks: formData.remarks,
                    shippingDocs: formData.shippingDocs
                } });
            } else {
                console.error('Error planning trip:', data);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Plan Your Trip</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <h6>Trip Details</h6>
                            <div className="mb-3">
                                <label className="form-label">Current Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="current_location"
                                    value={formData.current_location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Pickup Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pickup_location"
                                    value={formData.pickup_location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Drop-off Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="dropoff_location"
                                    value={formData.dropoff_location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Current Cycle Used (hours)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="current_cycle_used"
                                    value={formData.current_cycle_used}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6>Driver and Vehicle Information</h6>
                            <div className="mb-3">
                                <label className="form-label">Driver Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="driverName"
                                    value={formData.driverName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">License Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Carrier Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="carrierName"
                                    value={formData.carrierName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Home Terminal Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="homeTerminal"
                                    value={formData.homeTerminal}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Truck/Tractor Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="truckNumber"
                                    value={formData.truckNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Trailer Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="trailerNumber"
                                    value={formData.trailerNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">License Plates</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="licensePlates"
                                    value={formData.licensePlates}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Remarks</label>
                                <textarea
                                    className="form-control"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Shipping Documents</label>
                                <textarea
                                    className="form-control"
                                    name="shippingDocs"
                                    value={formData.shippingDocs}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Plan Trip</button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;