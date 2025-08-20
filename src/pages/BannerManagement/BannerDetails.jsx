import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BannerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bannersData } = location.state || {};
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

  // const formatStatus = (status) => {
  //   return status?.charAt(0)?.toUpperCase() + status?.slice(1);
  // };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };



  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          {/* Page Header */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <div className="page-title-box">
                <h4 className="mb-1">Banner Management</h4>
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
                  {/* User Details Sections */}
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">
                            Banner Image
                          </h5>
                        </div>
                        <div className="card-body">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                              <div>
                                <img
                                  src={bannersData?.images[0]}
                                  className="img-fluid"
                                  style={{ width: "100%", height: "250px" }}
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">
                            Banner Details
                          </h5>
                        </div>
                        <div className="card-body">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0 py-2">
                              <strong>Banner Tiitle:</strong>
                              <div className="text-muted">
                                {bannersData.title}
                              </div>
                            </li>
                            <li className="list-group-item px-0 py-2">
                              <strong>Banner Description:</strong>
                              <div className="text-muted">
                                {bannersData.description}
                              </div>
                            </li>
                            <li className="list-group-item px-0 py-2">
                              <strong>Banner Type:</strong>
                              <div className="text-muted">
                                {bannersData.type}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>


                  </div>



                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      {/* <button
                        className="btn btn-outline-danger me-2"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${bannersData._id}'s account?`
                            )
                          ) {
                            // Handle delete logic
                          }
                        }}
                      >
                        <i className="fas fa-trash-alt me-1"></i> Delete Account
                      </button> */}
                    </div>
                    <div>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          navigate("#", { state: { bannersData } })
                        }
                      >
                        <i className="fas fa-pencil-alt me-1"></i> Edit Profile
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/banner-listing")}
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

export default BannerDetails;
