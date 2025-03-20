// src/App.js
import React, { useState } from 'react';
import TripForm from './components/TripForm';
import TripMap from './components/TripMap';
import LogSheet from './components/LogSheet';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Add custom CSS

function App() {
    const [tripData, setTripData] = useState(null);

    const handleTripPlanned = (data) => {
        setTripData(data);
    };

    return (
        <div className="app-container">
            <header className="bg-primary text-white text-center py-3">
                <h1>Truck Trip Planner</h1>
            </header>
            <div className="container my-4">
                <TripForm onTripPlanned={handleTripPlanned} />
                {tripData && (
                    <div className="row">
                        <div className="col-md-8">
                            <TripMap route={tripData.route} />
                        </div>
                        <div className="col-md-4">
                            <LogSheet logSheets={tripData.log_sheets} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;