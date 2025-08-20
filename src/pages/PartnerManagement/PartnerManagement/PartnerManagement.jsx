import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData, deleteData } from "../../../utility/Utility";
import Swal from "sweetalert2";

function PartnerManagementList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await postData('partner/partnerListing', {
        search: searchTerm,
        // status: statusFilter === "all" ? "" : statusFilter,
        page: currentPage + 1,
        limit: rowsPerPage,
      });

      const partners = response.data.partners;
      setUsers(partners);
      setPageCount(response.data.totalPages)
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, rowsPerPage, currentPage]);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    setCurrentPage(0); // Reset to first page when applying filters
    fetchUsers();
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    // setStatusFilter("all");
    setCurrentPage(0);
    setRowsPerPage(10)
    fetchUsers();
  };

  // Handle user deletion with SweetAlert confirmation
  const handleDelete = async (pid) => {
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
        const response = await postData(`/partner/removePartner/${pid}`)
        if (response.status) {
          toast.success(response.message)
          fetchUsers();
        }
      } catch (error) {
        toast.error("Delete user error");
        console.error("Delete user error:", error);
      }
    }
  };
   const handleTogglePublish = async (id, newStatus) => {
        try {
            const response = await postData("partner/toggleIsPublished", {
                partnerId: id,
                isPublished: newStatus,
            });

            if (response?.status) {
                toast.success("Publish status updated");
                fetchUsers(); // Refresh the list
            } else {
                toast.error(response?.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating publish status");
        }
    };

  // Navigate to user details page
  const handleViewDetails = (user) => {
    navigate("/partner-details", { state: { userData: user } });
  };
  const handleEdit = (partner) => {
    navigate("/add-partner", { state: { userDataEdit: partner, type: "edit" } });
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          {/* Header Section */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Partner Management</h4>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-partner")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-account-plus me-1"></i>
                )}
                Add Partner
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                      <div className="col-md-12 col-lg-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control ps-4"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value), setCurrentPage(0) }}
                          />
                          <span className="input-group-text">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </div>
                      </div>

                      {/* <div className="col-md-12 col-lg-3">
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div> */}
                       <div className="col-lg-2">
                        <select
                          className="form-select"
                          value={rowsPerPage}
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(0);
                          }}
                        >
                          <option value={10}>Limit</option>
                          <option value={5}>5</option>
                          <option value={1}>1</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                      </div>

                      <div className="col-md-12 col-lg-3 d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleReset}
                          disabled={loading}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Profile</th>
                            <th>User Name</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            {/* <th>Role</th> */}
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th width="180px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0 ? (
                            users?.map((user) => (
                              <tr key={user._id}>
                                <td>
                                  <img
                                    src={user.image}
                                    alt={user.name}
                                    className="rounded-circle"
                                    width="40"
                                    height="40"
                                  />
                                </td>
                                <td>{user.userName}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNo}</td>
                                {/* <td>Employee</td> */}
                                {/* <td>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={user.status === "active"}
                                      onChange={() =>
                                        setUsers((prevUsers) =>
                                          prevUsers.map((u) =>
                                            u.id === user.id
                                              ? {
                                                ...u,
                                                status:
                                                  u.status === "active"
                                                    ? "inactive"
                                                    : "active",
                                              }
                                              : u
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                </td> */}
                                <td className="">
                                  <div className="form-check form-switch d-flex justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`publishSwitch-${user._id}`}
                                      checked={user.isPublished}
                                      onChange={() => handleTogglePublish(user._id, !user.isPublished)}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`publishSwitch-${user._id}`}
                                      title={user.isPublished ? "Unpublish" : "Publish"}
                                    ></label>
                                  </div>
                                </td>
                                <td>
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleViewDetails(user)}
                                      title="View Details"
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleEdit(user)}
                                      title="Edit"
                                    >
                                      <i className="mdi mdi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(user._id)}
                                      title="Delete"
                                    >
                                      <i className="mdi mdi-delete"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center py-4">
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                    </div>
                  )}
                  {/* Pagination */}

                  <div className="mt-3 d-flex justify-content-center">
                    <ReactPaginate
                      previousLabel={"←"}
                      nextLabel={"→"}
                      breakLabel={"..."}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"pagination"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      activeClassName={"active"}
                      forcePage={currentPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerManagementList;


