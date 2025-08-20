import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { postData } from "../../utility/Utility";
import { MdCurrencyRupee } from "react-icons/md";
function ServiceManagementList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pagecount, setPagecount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await postData(`/service/listing`, {
        search: searchTerm,
        page: currentPage + 1,
        limit: rowsPerPage,
      });
      const services = res?.data?.services || [];
      setUsers(services);
      setPagecount(res.data.totalPages)
    } catch (error) {
      // toast.error("Error fetching users");
      // console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, rowsPerPage]);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(0);
    setRowsPerPage(10)
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
        const res = await postData(`/service/remove/${id}`);
        if (res.status) {
          toast.dismiss();
          toast.success("Service deleted successfully");
          fetchUsers();
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


  const handleView = (user) => {
    navigate("/ViewService", { state: user })
  }
  const handleCategory = (userId) => {
    console.log("Category clicked for user ID:", userId);
  };

  console.log(users, "users")
  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          {/* Header */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Service Management</h4>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-services")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-account-plus me-1"></i>
                )}
                Add Service
              </button>
            </div>
          </div>

          {/* Search and Filter */}
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
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value), setCurrentPage(0) }}
                          />
                          <span className="input-group-text">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-2">
                        <select
                          className="form-select"
                          value={rowsPerPage}
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(0); // Reset to first page
                          }}
                        >
                          <option value={10}>Limit</option>
                          <option value={5}>5</option>

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

          {/* Table */}
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
                            <th>Name</th>
                            {/* <th>Description</th> */}
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Child Category</th>
                            {/* <th>Image</th> */}
                            <th>Actions</th>
                            {/* <th>Category</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0 ? (
                            users.map((user) => (
                              <tr key={user._id}>
                                <td>{user.name || "N/A"}</td>
                                <td>{user?.subCategoryId?.categoryId?.name || "-"}</td>
                                <td>{user?.subCategoryId?.name || "N/A"}</td>
                                <td>{user?.childCategoryId?.name || "-"}</td>
                                <td><MdCurrencyRupee />{user.price || "N/A"}</td>
                                <td>{user.sellingType || "N/A"}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleView(user)}
                                      title="View image"
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() =>
                                        navigate(`/add-services`, {
                                          state: { userData: user },
                                        })
                                      }
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
                                {/* <td>
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => handleCategory(user._id)}
                                    title="Show Category"
                                  >
                                    <i className="mdi mdi-arrow-right"></i>
                                  </button>
                                </td> */}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="10" className="text-center py-4">
                                No services found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <div className="d-flex justify-content-center">

                        <ReactPaginate
                          previousLabel={<i className="mdi mdi-chevron-left"></i>}
                          nextLabel={<i className="mdi mdi-chevron-right"></i>}
                          breakLabel="..."
                          pageCount={pagecount}
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

export default ServiceManagementList;
