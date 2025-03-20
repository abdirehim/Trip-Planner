// src/components/LogSheet.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LogSheet = ({ logSheets }) => {
    if (!logSheets || logSheets.length === 0) {
        return <div className="alert alert-warning mt-4">No log sheets available</div>;
    }

    const getStatusDescription = (status) => ({
        ON: 'On Duty (e.g., loading/unloading)',
        D: 'Driving',
        SB: 'Sleeper Berth (rest)',
        OFF: 'Off Duty'
    }[status] || 'Unknown');

    return (
        <div className="log-sheet">
            <h3 className="card-title">Daily Log Sheets</h3>
            {logSheets.map((sheet) => (
                <div key={sheet.day} className="card mb-3">
                    <div className="card-header">Day {sheet.day}</div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Hour</th>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <th key={i}>{i}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Status</td>
                                    {sheet.log.map((status, hour) => (
                                        <td
                                            key={hour}
                                            className={`${
                                                status === 'D' ? 'bg-primary' :
                                                status === 'ON' ? 'bg-warning' :
                                                status === 'SB' ? 'bg-success' :
                                                'bg-secondary'
                                            } text-center`}
                                            title={getStatusDescription(status)}
                                        >
                                            {status}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LogSheet;