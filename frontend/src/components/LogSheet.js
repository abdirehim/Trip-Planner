// // src/components/LogSheet.js
// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const LogSheet = ({ logSheets }) => {
//     if (!logSheets || logSheets.length === 0) {
//         return <div className="alert alert-warning mt-4">No log sheets available</div>;
//     }

//     const getStatusDescription = (status) => ({
//         ON: 'On Duty (e.g., loading/unloading)',
//         D: 'Driving',
//         SB: 'Sleeper Berth (rest)',
//         OFF: 'Off Duty'
//     }[status] || 'Unknown');

//     return (
//         <div className="log-sheet">
//             <h3 className="card-title">Daily Log Sheets</h3>
//             {logSheets.map((sheet) => (
//                 <div key={sheet.day} className="card mb-3">
//                     <div className="card-header">Day {sheet.day}</div>
//                     <div className="card-body">
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th>Hour</th>
//                                     {Array.from({ length: 24 }, (_, i) => (
//                                         <th key={i}>{i}</th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>Status</td>
//                                     {sheet.log.map((status, hour) => (
//                                         <td
//                                             key={hour}
//                                             className={`${
//                                                 status === 'D' ? 'bg-primary' :
//                                                 status === 'ON' ? 'bg-warning' :
//                                                 status === 'SB' ? 'bg-success' :
//                                                 'bg-secondary'
//                                             } text-center`}
//                                             title={getStatusDescription(status)}
//                                         >
//                                             {status}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default LogSheet;




// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const LogSheet = ({ logSheets }) => {
//     if (!logSheets || logSheets.length === 0) {
//         return <div className="alert alert-info mt-4">No log sheets available</div>;
//     }

//     const getStatusClass = (status) => {
//         switch (status) {
//             case 'ON': return 'bg-warning text-white';
//             case 'D': return 'bg-primary text-white';
//             case 'SB': return 'bg-success text-white';
//             case 'OFF': return 'bg-secondary text-white';
//             default: return 'bg-light';
//         }
//     };

//     const calculateMilesDriven = (drivingHours) => {
//         const avgSpeed = 60; // From backend AVG_SPEED
//         return drivingHours * avgSpeed;
//     };

//     const calculateStatusHours = (log) => {
//         const statusCounts = { ON: 0, D: 0, SB: 0, OFF: 0 };
//         log.forEach(status => {
//             statusCounts[status] = (statusCounts[status] || 0) + 1;
//         });
//         return statusCounts;
//     };

//     return (
//         <div className="card log-sheet-container">
//             <div className="card-header bg-secondary text-white">
//                 <h5 className="mb-0">Daily Log Sheets</h5>
//             </div>
//             <div className="card-body p-0">
//                 {logSheets.map((sheet, index) => {
//                     const statusCounts = calculateStatusHours(sheet.log);
//                     const drivingHours = statusCounts.D;
//                     const milesDriven = calculateMilesDriven(drivingHours);
//                     return (
//                         <div key={index} className="mb-4">
//                             <h6 className="px-3 pt-3">Day {sheet.day}</h6>
//                             <div className="table-responsive">
//                                 <table className="table table-bordered table-sm log-sheet-table">
//                                     <thead>
//                                         <tr>
//                                             <th className="bg-light">Hour</th>
//                                             {Array.from({ length: 24 }, (_, i) => (
//                                                 <th key={i} className="bg-light text-center">
//                                                     {i}
//                                                     {(i === 6 || i === 12 || i === 18) && (
//                                                         <div className="mid-day-marker">
//                                                             {i === 6 ? '6 AM' : i === 12 ? '12 PM' : '6 PM'}
//                                                         </div>
//                                                     )}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td className="bg-light">Status</td>
//                                             {sheet.log.map((status, hour) => (
//                                                 <td key={hour} className={`text-center ${getStatusClass(status)}`}>
//                                                     {status}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="px-3 pb-3">
//                                 <p><strong>Total Miles Driven:</strong> {milesDriven} miles</p>
//                                 <p><strong>Status Summary:</strong></p>
//                                 <ul>
//                                     <li>Off Duty: {statusCounts.OFF} hours</li>
//                                     <li>Sleeper Berth: {statusCounts.SB} hours</li>
//                                     <li>Driving: {statusCounts.D} hours</li>
//                                     <li>On Duty (Not Driving): {statusCounts.ON} hours</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default LogSheet;








import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LogSheet = ({ logSheets }) => {
    if (!logSheets || logSheets.length === 0) {
        return <div className="alert alert-info mt-4">No log sheets available</div>;
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'ON': return 'bg-warning text-white';
            case 'D': return 'bg-primary text-white';
            case 'SB': return 'bg-success text-white';
            case 'OFF': return 'bg-secondary text-white';
            default: return 'bg-light';
        }
    };

    const calculateMilesDriven = (drivingHours) => {
        const avgSpeed = 60; // From backend AVG_SPEED
        return drivingHours * avgSpeed;
    };

    const calculateStatusHours = (log) => {
        const statusCounts = { ON: 0, D: 0, SB: 0, OFF: 0 };
        log.forEach(status => {
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        return statusCounts;
    };

    return (
        <div className="card log-sheet-container">
            <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Daily Log Sheets</h5>
            </div>
            <div className="card-body p-0">
                {logSheets.map((sheet, index) => {
                    const statusCounts = calculateStatusHours(sheet.log);
                    const drivingHours = statusCounts.D;
                    const milesDriven = calculateMilesDriven(drivingHours);
                    return (
                        <div key={index} className="mb-4">
                            <h6 className="px-3 pt-3">Day {sheet.day}</h6>
                            <div className="table-responsive">
                                <table className="table table-bordered log-sheet-table">
                                    <thead>
                                        <tr>
                                            <th className="bg-light fixed-width-label">Hour</th>
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <th key={i} className="bg-light text-center">
                                                    {i}
                                                    {(i === 6 || i === 12 || i === 18) && (
                                                        <div className="mid-day-marker">
                                                            {i === 6 ? '6 AM' : i === 12 ? '12 PM' : '6 PM'}
                                                        </div>
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="bg-light fixed-width-label">Status</td>
                                            {sheet.log.map((status, hour) => (
                                                <td key={hour} className={`text-center ${getStatusClass(status)}`}>
                                                    {status}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-3 pb-3">
                                <p><strong>Total Miles Driven:</strong> {milesDriven} miles</p>
                                <p><strong>Status Summary:</strong></p>
                                <ul>
                                    <li>Off Duty: {statusCounts.OFF} hours</li>
                                    <li>Sleeper Berth: {statusCounts.SB} hours</li>
                                    <li>Driving: {statusCounts.D} hours</li>
                                    <li>On Duty (Not Driving): {statusCounts.ON} hours</li>
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LogSheet;