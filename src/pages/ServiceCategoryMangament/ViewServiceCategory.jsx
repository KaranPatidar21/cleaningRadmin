import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const ViewServiceCategory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const service = location.state || {};

    return (
        <div className="content-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="content container-fluid">
                <h4 className="fs-18 fw-semibold my-3">Service Category Details</h4>

                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5><i className="mdi mdi-eye me-2"></i>Service Information</h5>
                    </div>
                    <div className="card-body">
                        <ul className="row">
                            <Detail label="Service Name" value={service.name} />
                            <Detail label="Description" value={service.description} />
                            <Detail label="Selling Type" value={service.sellingType} />
                            <Detail label="Size" value={service.size} />
                            <Detail label="Price" value={service.price} />
                            <Detail label="Created At" value={formatDate(service.createdAt)} />
                            <Detail label="Updated At" value={formatDate(service.updatedAt)} />
                        </ul>

                        <div className="mt-4">
                            <strong>Icon:</strong>
                            <div className="mt-2">
                                {service.icon ? (
                                    <img
                                        src={service.icon}
                                        alt="Service Icon"
                                        style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                ) : (
                                    <p className="text-muted">No icon available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/service-category")}
                    >
                        <i className="mdi mdi-arrow-left-bold me-1"></i> Back to List
                    </button>
                </div>
            </div>
        </div>
    );
};

const Detail = ({ label, value }) => {
    return (
        <li className="col-md-6 list-group-item bookingDetailsList">
            <div className="bookingDetailsListborder">
                <strong>{label}*</strong>
                <div className="text-muted">{value || "N/A"}</div>
            </div>
        </li>
    );
};

const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString();
};

export default ViewServiceCategory;
