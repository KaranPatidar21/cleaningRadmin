import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, deleteData, postData } from "../../../utility/Utility";
import Swal from "sweetalert2";
import { RiH6 } from "react-icons/ri";

function SubCategoryList() {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [message, setMessage] = useState("")
  // Fetch SubCategories from API with pagination, search and filter
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await postData("/subCategory/listing", {
        limit: limit,
        page: currentPage + 1,
        search: searchTerm,
      });

      if (response.status) {
        setSubCategories(response.data.subCategories);
        setPageCount(response.data.pagination.totalPages);
        setMessage("")
      } else {
        setMessage(response.message)
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubCategories();
  }, [currentPage, limit, searchTerm]);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchSubCategories();
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(0);
    setLimit(10);
    fetchSubCategories();
  };

  // Delete subcategory
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
        const response = await postData(`/subCategory/remove`, {
          subCategoryId: id
        });
        if (response.status) {
          toast.success("Subcategory deleted successfully");
          fetchSubCategories();
        } else {
          toast.error(response.message || "Failed to delete subcategory");
        }
      } catch (error) {
        toast.error("Error deleting subcategory");
      }
    }
  };

  // Toggle publish/unpublish
  const handleTogglePublish = async (id, newStatus) => {
    try {
      const response = await postData("subCategory/toggleIsPublished/", {
        subCategoryId: id,
        isPublished: newStatus,
      });

      if (response?.status) {
        toast.success("Publish status updated");
        fetchSubCategories();
        // Refresh the list
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating publish status");
    }
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          {/* Header Section */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <h4 className="fs-18 fw-semibold m-0">Sub Category List</h4>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-subcategory")}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-1"></span>
              ) : (
                <i className="mdi mdi-plus-square me-1"></i>
              )}
              Add Sub Category
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-3">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value), setCurrentPage(0) }}
                    />
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={limit}
                      onChange={(e) => {
                        setLimit(parseInt(e.target.value));
                        setCurrentPage(0);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={2}>2</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="col-md-4 d-flex gap-2">
                    {/* <button type="submit" className="btn btn-primary">
                      Apply Filters
                    </button> */}
                    <button type="button" className="btn btn-secondary" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* SubCategory Table */}
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Publish/Unpublish</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {message === "" ? <>

                        {subCategories?.map((item, index) => (
                          <tr key={item.subcategory_id}>
                            <td>{index + 1 + currentPage * limit}</td>
                            <td>{item.name}</td>
                            <td>{item.categoryId?.name || "N/A"}</td>
                            <td>{item.description || "-"}</td>
                            <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`publishSwitch-${item._id}`}
                                  checked={item.isPublished}
                                  onChange={() => handleTogglePublish(item._id, !item.isPublished)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`publishSwitch-${item._id}`}
                                  title={item.isPublished ? "Unpublish" : "Publish"}
                                ></label>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() =>
                                    navigate(`/view-subcategory`, {
                                      state: { subCategoryData: item },
                                    })
                                  }
                                >
                                  <i className="mdi mdi-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    navigate(`/add-subcategory`, {
                                      state: { subCategoryData: item },
                                    })
                                  }
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}</> : <h6>{message}</h6>}

                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="d-flex justify-content-center">

                    <ReactPaginate
                      previousLabel={<i className="mdi mdi-chevron-left"></i>}
                      nextLabel={<i className="mdi mdi-chevron-right"></i>}
                      breakLabel="..."
                      pageCount={pageCount}
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
  );
}

export default SubCategoryList;
