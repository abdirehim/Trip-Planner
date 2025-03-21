import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DriverInfo = ({ driverInfo, totalMiles }) => {
    return (
        <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Driver and Vehicle Information</h5>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <p><strong>Driver Name:</strong> {driverInfo.name || 'N/A'}</p>
                        <p><strong>License Number:</strong> {driverInfo.licenseNumber || 'N/A'}</p>
                        <p><strong>Carrier Name:</strong> {driverInfo.carrierName || 'N/A'}</p>
                        <p><strong>Home Terminal Address:</strong> {driverInfo.homeTerminal || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                        <p><strong>Truck/Tractor Number:</strong> {driverInfo.truckNumber || 'N/A'}</p>
                        <p><strong>Trailer Number:</strong> {driverInfo.trailerNumber || 'N/A'}</p>
                        <p><strong>License Plates:</strong> {driverInfo.licensePlates || 'N/A'}</p>
                        <p><strong>Total Miles Driven Today:</strong> {totalMiles || 'N/A'}</p>
                    </div>
                </div>
                <div className="mt-3">
                    <h6>Remarks</h6>
                    <p>{driverInfo.remarks || 'No remarks'}</p>
                </div>
                <div className="mt-3">
                    <h6>Shipping Documents</h6>
                    <p>{driverInfo.shippingDocs || 'No shipping documents'}</p>
                </div>
            </div>
        </div>
    );
};

export default DriverInfo;