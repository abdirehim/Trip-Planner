// // src/App.js
// import React, { useState } from 'react';
// import TripForm from './components/TripForm';
// import TripMap from './components/TripMap';
// import LogSheet from './components/LogSheet';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// function App() {
//     const [tripData, setTripData] = useState(null);

//     const handleTripPlanned = (data) => {
//         setTripData(data);
//     };

//     return (
//         <div className="app-container">
//             <header className="bg-primary text-white text-center py-3">
//                 <h1>Truck Trip Planner</h1>
//             </header>
//             <div className="container my-4">
//                 <TripForm onTripPlanned={handleTripPlanned} />
//                 {tripData && (
//                     <div className="row">
//                         <div className="col-md-8">
//                             <TripMap
//                                 route={tripData.route}
//                                 logSheets={tripData.log_sheets}
//                                 fueling_stops={tripData.fueling_stops}
//                                 total_distance={tripData.total_distance}
//                             />
//                         </div>
//                         <div className="col-md-4">
//                             <LogSheet logSheets={tripData.log_sheets} />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default App;



// import React, { useState } from 'react';
// import TripForm from './components/TripForm';
// import TripMap from './components/TripMap';
// import LogSheet from './components/LogSheet';
// import DriverInfo from './components/DriverInfo';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// function App() {
//     const [tripData, setTripData] = useState(null);

//     const handleTripPlanned = (data) => {
//         setTripData(data);
//     };

//     return (
//         <div className="app-container">
//             <header className="bg-primary text-white text-center py-3">
//                 <h1>Truck Trip Planner</h1>
//             </header>
//             <div className="container my-4">
//                 <TripForm onTripPlanned={handleTripPlanned} />
//                 {tripData && (
//                     <div className="row">
//                         <div className="col-md-8">
//                             <TripMap
//                                 route={tripData.route}
//                                 logSheets={tripData.log_sheets}
//                                 fueling_stops={tripData.fueling_stops}
//                                 total_distance={tripData.total_distance}
//                             />
//                         </div>
//                         <div className="col-md-4">
//                             <DriverInfo
//                                 driverInfo={tripData.driverInfo}
//                                 totalMiles={tripData.log_sheets.reduce((total, sheet) => {
//                                     const drivingHours = sheet.log.filter(status => status === 'D').length;
//                                     return total + (drivingHours * 60); // AVG_SPEED = 60 mph
//                                 }, 0)}
//                             />
//                             <LogSheet logSheets={tripData.log_sheets} />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default App;





import React, { useState } from 'react';
import TripForm from './components/TripForm';
import TripMap from './components/TripMap';
import LogSheet from './components/LogSheet';
import DriverInfo from './components/DriverInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
                    <>
                        <div className="row mb-4">
                            <div className="col-12">
                                <TripMap
                                    route={tripData.route}
                                    logSheets={tripData.log_sheets}
                                    fueling_stops={tripData.fueling_stops}
                                    total_distance={tripData.total_distance}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-4 mb-4">
                                <DriverInfo
                                    driverInfo={tripData.driverInfo}
                                    totalMiles={tripData.log_sheets.reduce((total, sheet) => {
                                        const drivingHours = sheet.log.filter(status => status === 'D').length;
                                        return total + (drivingHours * 60); // AVG_SPEED = 60 mph
                                    }, 0)}
                                />
                            </div>
                            <div className="col-12 col-md-8">
                                <LogSheet logSheets={tripData.log_sheets} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;