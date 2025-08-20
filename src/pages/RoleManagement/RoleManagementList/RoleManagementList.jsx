import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { deleteData, getData, postData } from "../../../utility/Utility";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import '../../../../public/assets/css/app.min.css'

function RoleManagementList() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const rowsPerPage = 10;

  // Fetch roles from API
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getData("api/role/get-all");
      if (response?.success) {
        setRoles(response?.results);
        const pageCount = Math.ceil(response?.pagination?.total / rowsPerPage);
        console.log({pageCount})
        setPageCount(pageCount);
      } else {
        toast.error(response?.message || "Failed to fetch roles");
      }
    } catch (error) {
      toast.error("Error fetching roles");
      console.error("Fetch roles error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle role deletion with SweetAlert confirmation
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
        const response = await deleteData(`api/role/delete/${id}`);
        if (response.success) {
          toast.success("Role deleted successfully");
          fetchRoles(); // Refresh the list
        } else {
          toast.error(response.message || "Failed to delete role");
        }
      } catch (error) {
        toast.error("Error deleting role");
        console.error("Delete role error:", error);
      }
    }
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          {/* Header Section */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Role List</h4>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-role")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-plus-square me-1"></i>
                )}
                Add Role
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-8 col-lg-4">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control ps-4"
                          placeholder="Search roles..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="input-group-text">
                          <i className="mdi mdi-magnify"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Table */}
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
                            <th>S.No</th>
                            <th>Role Name</th>
                            <th>Created At</th>
                            <th width="120px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roles.length > 0 ? (
                            roles.map((role, index) => (
                              <tr key={role._id}>
                                <td>{index + 1}</td>
                                <td>{role?.role_name}</td>

                                <td>
                                  {new Date(
                                    role?.created_at
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() =>
                                        navigate(`/update-role`,{state:role})
                                      }
                                    >
                                      <i className="mdi mdi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(role?.role_id)}
                                    >
                                      <i className="mdi mdi-delete"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                No roles found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Pagination */}

                      <ReactPaginate
                        previousLabel={<i className="mdi mdi-chevron-left"></i>}
                        nextLabel={<i className="mdi mdi-chevron-right"></i>}
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName="pagination pagination-rounded justify-content-end mt-3"
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

export default RoleManagementList;
