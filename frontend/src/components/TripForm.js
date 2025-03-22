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
            const response = await fetch('https://trip-planner-backend-h2df.onrender.com/api/plan-trip/', {
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