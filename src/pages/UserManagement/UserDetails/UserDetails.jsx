import React from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
// import UserOrderTable from "../UserOrderTable/UserOrderTable";
import { postData } from "../../../utility/Utility";

function UserDetails() {
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
    return status?.charAt(0)?.toUpperCase() + status?.slice(1);
  };

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
        const res = await  postData(`user/remove`, {userId: id });
        if(res.status){
          toast.dismiss()

        toast.success("User deleted successfully");
        navigate("/user-management");
        }
        else{
          toast.dismiss()
          toast.success("User can't deleted ");

        }
      } catch (error) {
        toast.dismiss()

        toast.error("Delete user error");
        console.error(error);
      }
    }
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
                        src={userData.img || "/default-avatar.png"}
                        alt={userData.name}
                        className="rounded-circle border border-3 border-light"
                        width="120"
                        height="120"
                        // onError={(e) => {
                        //   e.target.onerror = null;
                        //   e.target.src = "/default-avatar.png";
                        // }}
                      />
                      <span
                        className={`position-absolute bottom-0 end-0 badge rounded-pill p-2 border border-2 border-white bg-${getRoleBadgeColor(
                          userData.role
                        )}`}
                      >
                        <i
                          className={`fas fa-${
                            userData.role === "Admin" ? "crown" : "user"
                          } fs-6`}
                        ></i>
                      </span>
                    </div>
                    <div className="text-center text-md-start">
                      <h3 className="mb-2">{userData.name}</h3>
                      <h5>{userData.userName || "N/A"}</h5>
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
                                  <a href={`tel:${userData.phoneNo}`} style={{color:"rgba(74, 90, 107, 0.75)"}}>
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
                            {/* <li className="list-group-item px-0 py-2">
                              <strong>Last Active:</strong>
                              <div className="text-muted">
                                {userData.lastActive
                                  ? formatDate(userData.lastActive)
                                  : "Unknown"}
                              </div>
                            </li> */}
                            <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                              {/* <div>
                                <strong>Account Status:</strong>
                                <div>
                                  <span
                                    className={`badge ${getStatusBadgeClass(
                                      userData.status
                                    )}`}
                                  >
                                    {formatStatus(userData.status)}
                                  </span>
                                </div>
                              </div> */}
                              {userData.status === "blocked" && (
                                <button className="btn btn-sm btn-outline-success">
                                  <i className="fas fa-unlock me-1"></i> Unblock
                                </button>
                              )}
                            </li>
                          </ul>
                        </div>
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
                        className="btn btn-outline-danger me-2"
                        onClick={() => handleDelete(userData._id)}
                      >
                        <i className="fas fa-trash-alt me-1"></i> Delete Account
                      </button>
                    </div>
                    <div>
                      {/* <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          navigate("#", { state: { userData } })
                        }
                      >
                        <i className="fas fa-pencil-alt me-1"></i> Edit Profile
                      </button> */}
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/user-management")}
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

export default UserDetails;
