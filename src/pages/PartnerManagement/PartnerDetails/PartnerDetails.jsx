import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import UserOrderTable from "../UserOrderTable/UserOrderTable";

function PartnerDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = location.state || {};
    const [loading, setLoading] = React.useState(false);

    // Helper functions moved inside component to avoid recreation on each render
    const getRoleBadgeColor = (role) => {
        const roleColors = {
            Admin: "primary",
            Manager: "info",
            Moderator: "warning",
            User: "secondary",
        };
        return roleColors[role] || "secondary";
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            active: "bg-success",
            inactive: "bg-warning",
            blocked: "bg-danger",
            pending: "bg-info",
        };
        return statusClasses[status] || "bg-secondary";
    };

    const formatStatus = (status) => {
        return status?.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (!userData) {
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
                                            User data not found. Please select a user from the list.
                                        </div>
                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => navigate("/user-management")}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to User List
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
            <div className="content">
                <div className="container-fluid">
                    {/* Page Header */}
                    <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                        <div className="flex-grow-1">
                            <div className="page-title-box">
                                <h4 className="mb-1">User Management</h4>
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item">Users Details</li>
                                    <li className="breadcrumb-item active">{userData.name}</li>
                                </ol>
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    {/* User Profile Header */}
                                    <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                                        <div className="position-relative me-0 me-md-3 mb-3 mb-md-0">
                                            <img
                                                src={userData.image || "/default-avatar.png"}
                                                alt={userData.name}
                                                className="rounded-circle border border-3 border-light"
                                                width="120"
                                                height="120"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/default-avatar.png";
                                                }}
                                            />
                                            <span
                                                className={`position-absolute bottom-0 end-0 badge rounded-pill p-2 border border-2 border-white bg-${getRoleBadgeColor(
                                                    " Employee"
                                                )}`}
                                            >
                                                <i
                                                    className={`fas fa-${userData?.role === "Admin" ? "crown" : "user"
                                                        } fs-6`}
                                                ></i>
                                            </span>
                                        </div>
                                        <div className="text-center text-md-start">
                                            <h2 className="mb-2">{userData.name}</h2>
                                           <h5>{userData.userName}</h5>
                                        </div>
                                    </div>

                                    {/* User Details Sections */}
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="card mb-4">
                                                <div className="card-header bg-light">
                                                    <h5 className="mb-0">
                                                        <i className="fas fa-id-card me-2"></i>
                                                        Personal Information
                                                    </h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>Email:</strong>
                                                                <div className="text-muted">
                                                                    {userData.email}
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={`mailto:${userData.email}`}
                                                                className="btn btn-sm btn-outline-secondary"
                                                            >
                                                                <i className="fas fa-envelope"></i>
                                                            </a>
                                                        </li>
                                                        <li className="list-group-item px-0 py-2">
                                                            <strong>Phone:</strong>
                                                            <div className="text-muted">
                                                                {userData.phoneNo ? (
                                                                    <a href={`tel:${userData.phoneNo}`}>
                                                                        {userData.phoneNo}
                                                                    </a>
                                                                ) : (
                                                                    "Not provided"
                                                                )}
                                                            </div>
                                                        </li>
                                                        {userData.address && (
                                                            <li className="list-group-item px-0 py-2">
                                                                <strong>Address:</strong>
                                                                <div className="text-muted">
                                                                    {userData.address}
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="card mb-4">
                                                <div className="card-header bg-light">
                                                    <h5 className="mb-0">
                                                        <i className="fas fa-user-cog me-2"></i>
                                                        Account Information
                                                    </h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 py-2">
                                                            <strong>Member Since:</strong>
                                                            <div className="text-muted">
                                                                {formatDate(userData.createdAt)}
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 py-2">
                                                            <strong>Services</strong>
                                                            <div className="text-muted ps-3">
                                                               {userData.services.map((items)=>(
                                                                <li>{items.name}</li>
                                                               ))}
                                                            </div>
                                                        </li>
                                                      


                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {(userData.identityCard || userData.idProof || userData.vehicalImage || userData.drivingLicence) && (
                                            <div className="card mb-4">
                                                <div className="card-header bg-light">
                                                    <h5 className="mb-0">
                                                        <i className="fas fa-file-image me-2"></i>
                                                        Uploaded Documents
                                                    </h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        {userData.profileImage && (
                                                            <div className="col-md-4 text-center mb-3">
                                                                <label className="form-label fw-bold">Profile Photo</label>
                                                                <div className="border rounded p-2">
                                                                    <img
                                                                        src={userData.profileImage}
                                                                        alt="Profile"
                                                                        className="img-fluid rounded"
                                                                        style={{ maxHeight: "180px" }}
                                                                        onError={(e) => (e.target.src = "/default-avatar.png")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userData.aadharImage && (
                                                            <div className="col-md-4 text-center mb-3">
                                                                <label className="form-label fw-bold">Aadhar Card</label>
                                                                <div className="border rounded p-2">
                                                                    <img
                                                                        src={userData.aadharImage}
                                                                        alt="Aadhar"
                                                                        className="img-fluid"
                                                                        style={{ maxHeight: "180px" }}
                                                                        onError={(e) => (e.target.style.display = "none")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userData.panImage && (
                                                            <div className="col-md-4 text-center mb-3">
                                                                <label className="form-label fw-bold">PAN Card</label>
                                                                <div className="border rounded p-2">
                                                                    <img
                                                                        src={userData.panImage}
                                                                        alt="PAN"
                                                                        className="img-fluid"
                                                                        style={{ maxHeight: "180px" }}
                                                                        onError={(e) => (e.target.style.display = "none")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="row">
                                            <div className="col-md-3 p-2">
                                                <div className="mb-2">
                                                    <img
                                                        src={userData.idProof ? userData.idProof : "https://www.sarkariyojnaa.info/wp-content/uploads/2021/09/aadhar-card.jpg"}
                                                        alt=""
                                                        className="img-fluid rounded"
                                                        style={{ height: "140px" }}
                                                    />

                                                </div>
                                                <h6>Aadhar Card*</h6>
                                            </div>
                                            <div className="col-md-3 p-2">
                                                <div className="mb-2">

                                                    <img src={userData.drivingLicence ? userData.drivingLicence : "https://media.istockphoto.com/id/691286862/vector/flat-man-driver-license-plastic-card-template-id-card-vector-illustration.jpg?s=612x612&w=0&k=20&c=c-tDqF5B4t2i_eoJXwWsUK05q8ORuLmRbeCa7weLtGc="}
                                                        alt=""
                                                        className="img-fluid rounded" style={{ height: "140px" }} />
                                                </div>
                                                <h6>Driving Licence*</h6>
                                            </div>
                                            <div className="col-md-3 p-2">
                                                <div className="mb-2" >
                                                    <img src={userData.vehicleImage ? userData.vehicleImage : "https://cdn.pixabay.com/photo/2012/04/12/23/47/car-30984_1280.png"}
                                                        alt=""
                                                        className="img-fluid rounded " style={{ height: "140px" }} />
                                                </div>
                                                <h6>Vehical Image*</h6>
                                            </div>
                                            <div className="col-md-3 p-2">
                                                <div className="mb-2" >
                                                    <img
                                                        src={userData.identityCard ? userData.identityCard : "https://4.imimg.com/data4/LC/VV/ANDROID-19229205/product-500x500.jpeg"}
                                                        alt=""
                                                        className="img-fluid rounded " style={{ height: "140px" }} />
                                                </div>
                                                <h6>Identity Card*</h6>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Additional Sections */}
                                    {userData.bio && (
                                        <div className="card mb-4">
                                            <div className="card-header bg-light">
                                                <h5 className="mb-0">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    About
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <p className="mb-0">{userData.bio}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-between mt-4">
                                      
                                        <div>
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => navigate("/partner-management")}
                                            >
                                                <i className="fas fa-users me-1"></i> View All Users
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <UserOrderTable /> */}
                </div>
            </div>
        </div>
    );
}

export default PartnerDetails;
