import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utility/Utility";

function ViewService() {
    const location = useLocation();
    const navigate = useNavigate();
    const serviceData = location.state;

    const [loading, setLoading] = React.useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const res = await postData(`service/remove/${id}`);
                if (res.status) {
                    toast.dismiss();
                    toast.success("Service deleted successfully");
                    setTimeout(() => {
                        navigate("/service-management");
                    }, 1500);
                } else {
                    // toast.dismiss();
                    // toast.success("Service can't deleted ");
                }
            } catch (error) {
                toast.dismiss();

                // toast.error("Delete service error");
                console.error(error);
            }
        }
    };
    // const handleDelete = async (id) => {
    //     const result = await Swal.fire({
    //         title: "Are you sure?",
    //         text: "You won't be able to revert this!",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Yes, delete it!",
    //     });

    //     if (result.isConfirmed) {
    //         try {
    //             const res = await postData(`service/delete`, { serviceId: id });
    //             if (res.status) {
    //                 toast.dismiss();
    //                 toast.success("Service deleted successfully");
    //                 navigate("/service-management");
    //             } else {
    //                 toast.dismiss();
    //                 toast.error("Service can't be deleted");
    //             }
    //         } catch (error) {
    //             toast.dismiss();
    //             toast.error("Delete service error");
    //             console.error(error);
    //         }
    //     }
    // };

    if (!serviceData) {
        return (
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="card">
                                    <div className="card-body text-center p-5">
                                        <div className="alert alert-warning mb-4">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            Service data not found. Please select a service.
                                        </div>
                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => navigate("/service-management")}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to Service List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="content-page">
            <ToastContainer />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h4 className="mb-0">Service Details</h4>
                            <small className="text-muted">{serviceData.name}</small>
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-secondary me-2"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(serviceData._id)}
                                disabled={loading}
                            >
                                <i className="fas fa-trash me-1"></i> Delete
                            </button>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">
                                <i className="fas fa-info-circle me-2"></i>Service Information
                            </h5>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item px-0 py-2"><strong>Name:</strong> {serviceData.name}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Description:</strong> {serviceData.description || "N/A"}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Price:</strong> ₹{serviceData.price || "0.00"}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Selling Type:</strong> {serviceData.sellingType || "N/A"}</li>

                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item px-0 py-2">
                                            <strong>
                                                {serviceData.sellingType === "seat"
                                                    ? "Seat"
                                                    : serviceData.sellingType === "piece"
                                                        ? "Piece"
                                                        : serviceData.sellingType === "sqft"
                                                            ? "Size"
                                                            : "Selling Detail"}
                                                :
                                            </strong>{" "}
                                            {serviceData.sellingType === "seat"
                                                ? serviceData.seat ?? "N/A"
                                                : serviceData.sellingType === "piece"
                                                    ? serviceData.piece ?? "N/A"
                                                    : serviceData.sellingType === "sqft"
                                                        ? serviceData.size ?? "N/A"
                                                        : "N/A"}
                                        </li>
                                        <li className="list-group-item px-0 py-2"><strong>Time:</strong> {serviceData.time ?? "N/A"} mins</li>
                                        <li className="list-group-item px-0 py-2"><strong>Category:</strong> {serviceData.subCategoryId?.categoryId?.name || "N/A"}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Subcategory:</strong> {serviceData.subCategoryId?.name || "N/A"}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(serviceData.icon || serviceData.image) && (
                        <div className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">Service Image</h5>
                                <img
                                    src={serviceData.icon || serviceData.image}
                                    alt={serviceData.name}
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "300px" }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewService;
