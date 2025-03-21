// // src/components/TripMap.js
// import React from 'react';
// import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const TripMap = ({ route, logSheets, fueling_stops, total_distance }) => {
//     if (!route || !route.features || !route.features[0]) {
//         return <div className="alert alert-warning mt-4">No route data available</div>;
//     }

//     const positions = route.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
//     const startIcon = new L.Icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] });
//     const stopIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', iconSize: [25, 41], iconAnchor: [12, 41] });
//     const fuelIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41] });
//     const restIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] });

//     const keyPoints = [
//         { pos: positions[0], label: 'Start (New York, NY)', icon: startIcon },
//         { pos: positions[Math.floor(positions.length / 2)], label: 'Pickup (Chicago, IL)', icon: stopIcon },
//         { pos: positions[positions.length - 1], label: 'Drop-off (Los Angeles, CA)', icon: stopIcon },
//     ];

//     // Add fueling stops based on distances from backend
//     if (fueling_stops && total_distance) {
//         fueling_stops.forEach(stop => {
//             const positionIndex = Math.floor((stop.distance / total_distance) * positions.length);
//             keyPoints.push({ pos: positions[positionIndex] || positions[0], label: `Fueling Stop (~${stop.distance.toFixed(0)} miles)`, icon: fuelIcon, day: stop.day });
//         });
//     }

//     // Add rest stops from log sheets
//     if (logSheets) {
//         logSheets.forEach(sheet => {
//             const restStart = sheet.log.indexOf('SB');
//             if (restStart !== -1) {
//                 const restPosition = positions[Math.floor((restStart / 24) * positions.length)];
//                 keyPoints.push({ pos: restPosition, label: `Rest Day ${sheet.day}`, icon: restIcon });
//             }
//         });
//     }

//     return (
//         <div className="card map-container">
//             <div className="card-header">Route Map</div>
//             <div className="card-body">
//                 <MapContainer
//                     center={positions[0]}
//                     zoom={4}
//                     style={{ height: '400px', width: '100%' }}
//                     className="map"
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                     />
//                     <Polyline positions={positions} color="#007bff" weight={5} />
//                     {keyPoints.map((point, index) => (
//                         <Marker key={index} position={point.pos} icon={point.icon}>
//                             <Popup>{point.label}</Popup>
//                             <Tooltip permanent={false} direction="top" offset={[0, -10]}>
//                                 {point.label}
//                             </Tooltip>
//                         </Marker>
//                     ))}
//                 </MapContainer>
//             </div>
//         </div>
//     );
// };

// export default TripMap;


// src/components/TripMap.js
import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TripMap = ({ route, logSheets, fueling_stops, total_distance }) => {
    if (!route || !route.features || !route.features[0]) {
        return <div className="alert alert-warning mt-4">No route data available</div>;
    }

    const positions = route.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    const startIcon = new L.Icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    const stopIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    const fuelIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    const restIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] });

    const keyPoints = [
        { pos: positions[0], label: 'Start (New York, NY)', icon: startIcon },
        { pos: positions[Math.floor(positions.length / 2)], label: 'Pickup (Chicago, IL)', icon: stopIcon },
        { pos: positions[positions.length - 1], label: 'Drop-off (Los Angeles, CA)', icon: stopIcon },
    ];

    // Add fueling stops
    if (fueling_stops && total_distance) {
        fueling_stops.forEach((stop, index) => {
            const positionIndex = Math.floor((stop.distance / total_distance) * positions.length);
            const position = positions[positionIndex] || positions[positions.length - 1];
            keyPoints.push({
                pos: position,
                label: `Fueling Stop ${index + 1} (~${Math.round(stop.distance)} miles, Day ${stop.day})`,
                icon: fuelIcon
            });
        });
    }

    // Add rest stops from log sheets
    if (logSheets) {
        logSheets.forEach(sheet => {
            const restStart = sheet.log.indexOf('SB');
            if (restStart !== -1) {
                const restPositionIndex = Math.floor((restStart / 24) * positions.length);
                const restPosition = positions[restPositionIndex] || positions[positions.length - 1];
                keyPoints.push({
                    pos: restPosition,
                    label: `Rest Day ${sheet.day} (Starts at Hour ${restStart})`,
                    icon: restIcon
                });
            }
        });
    }

    return (
        <div className="card map-container">
            <div className="card-header">Route Map</div>
            <div className="card-body">
                <MapContainer
                    center={positions[0]}
                    zoom={4}
                    style={{ height: '400px', width: '100%' }}
                    className="map"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Polyline positions={positions} color="#007bff" weight={5} />
                    {keyPoints.map((point, index) => (
                        <Marker key={index} position={point.pos} icon={point.icon}>
                            <Popup>{point.label}</Popup>
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                {point.label}
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default TripMap;