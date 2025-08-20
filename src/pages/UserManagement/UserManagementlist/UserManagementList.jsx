import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../../utility/Utility";
import Swal from "sweetalert2";

function UserManagementList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pagecount, setPagecount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // <-- Make it state, not constant

  // const [showModal, setShowModal] = useState(false);
  // const handleOpenModal = () => setShowModal(true);
  // const handleCloseModal = () => setShowModal(false);

  // Fetch users from API or use static data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await postData("user/listingUser", {
        search: searchTerm,
        limit: rowsPerPage,
        page: currentPage + 1,
      });

      console.log(res, "users response");

      setUsers(res?.data?.users || []);
      setPagecount(res?.data?.totalPages || 0);
    } catch (error) {
      toast.dismiss();

      toast.error("Error fetching users");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage, rowsPerPage]); // ✅ include rowsPerPage

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when applying filters
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    // setStatusFilter("all");
    setRowsPerPage(10);
    setCurrentPage(0);

    fetchUsers();
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
        const res = await postData(`user/remove`, { userId: id });
        if (res.status) {
          toast.dismiss();

          toast.success("User deleted successfully");
          fetchUsers();
        } else {
          toast.dismiss();
          toast.success("User can't deleted ");
        }
      } catch (error) {
        toast.dismiss();

        toast.error("Delete user error");
        console.error(error);
      }
    }
  };
  const handleViewDetails = (user) => {
    navigate("/user-details", { state: { userData: user } });
  };
  const paginatedUsers = users;

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          {/* {/ Header Section /} */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">User Management </h4>
            </div>
            {/* <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-user")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-account-plus me-1"></i>
                )}
                Add User
              </button>
            </div> */}
          </div>

          {/* {/ Search and Filter Section /} */}
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
                            onChange={(e) => {setSearchTerm(e.target.value), setCurrentPage(0)}}
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

                      <div className="col-md-12 col-lg-3 d-flex gap-2">
                        {/* <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          ) : null}
                          Apply Filters
                        </button> */}
                        <select
                          className="form-select"
                          value={rowsPerPage}
                          onChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value)); // ✅ update limit
                            setCurrentPage(0); // ✅ reset to page 1 when limit changes
                          }}
                        >
                          <option value={10}>Limit</option>
                          <option value={5}>5</option>

                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>

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

          {/* {/ Users Table /} */}
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
                            <th>PhoneNo</th>
                            <th>Joined Date</th>
                            <th width="180px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedUsers?.length > 0 ? (
                            paginatedUsers?.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <img
                                    src={user.img}
                                    alt={user.name}
                                    className="rounded-circle"
                                    width="40"
                                    height="40"
                                  />
                                </td>
                                <td>{user.userName || "N/A"}</td>
                                <td>{user.name || "Unkown"}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNo}</td>

                                <td>
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
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

                      {/* {/ Pagination /} */}
                      <ReactPaginate
                        previousLabel={<i className="mdi mdi-chevron-left"></i>}
                        nextLabel={<i className="mdi mdi-chevron-right"></i>}
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        pageCount={pagecount} // from backend totalPages
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName="pagination pagination-rounded justify-content-center mt-3"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={currentPage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementList;
