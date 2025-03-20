// src/components/TripForm.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TripForm = ({ onTripPlanned }) => {
    const [formData, setFormData] = useState({
        currentLocation: '',
        pickupLocation: '',
        dropoffLocation: '',
        currentCycleUsed: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/plan-trip/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_location: formData.currentLocation,
                    pickup_location: formData.pickupLocation,
                    dropoff_location: formData.dropoffLocation,
                    current_cycle_used: parseFloat(formData.currentCycleUsed) || 0
                })
            });
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            onTripPlanned(data); // Pass route and log sheets to parent
        } catch (error) {
            console.error('Error submitting trip:', error);
            alert('Failed to plan trip. Check console for details.');
        }
    };

    return (
        <div className="mt-4">
            <h3>Plan Your Trip</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="currentLocation" className="form-label">Current Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="currentLocation"
                        name="currentLocation"
                        value={formData.currentLocation}
                        onChange={handleChange}
                        placeholder="e.g., New York, NY"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pickupLocation" className="form-label">Pickup Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="e.g., Philadelphia, PA"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="dropoffLocation" className="form-label">Drop-off Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        placeholder="e.g., Washington, DC"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="currentCycleUsed" className="form-label">Current Cycle Used (hours)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="currentCycleUsed"
                        name="currentCycleUsed"
                        value={formData.currentCycleUsed}
                        onChange={handleChange}
                        min="0"
                        max="70"
                        step="0.5"
                        placeholder="e.g., 0"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Plan Trip</button>
            </form>
        </div>
    );
};

export default TripForm;