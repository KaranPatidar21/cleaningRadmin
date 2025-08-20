import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, deleteData, ImageBaseUrl } from "../../../utility/Utility";
import Swal from "sweetalert2";

function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const rowsPerPage = 10;

  // Fetch categories from API with pagination
  const fetchCategories = async (page = 0, search = "", status = "all") => {
    setLoading(true);
    try {
      // const offset = page +1;
      const offset = page * rowsPerPage;
      let url = `api/category/get-all?limit=${rowsPerPage}&offset=${offset}`;
      
      // Add search filter if provided
      if (search) {
        url += `&search=${search}`;
      }
      
      // Add status filter if not "all"
      if (status !== "all") {
        url += `&is_active=${status === "active"}`;
      }

      const response = await getData(url);
      
      if (response?.success) {
        setCategories(response?.results);
        const totalPages = Math.ceil(response.pagination?.total / rowsPerPage);
        setPageCount(totalPages);
      } else {
        toast.error(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when applying filters
    fetchCategories(0, searchTerm, statusFilter);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(0);
  };

  // Handle category deletion with SweetAlert confirmation
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
        const response = await deleteData(`api/category/delete/${id}`);
        if (response.success) {
          toast.success("Category deleted successfully");
          fetchCategories(currentPage, searchTerm, statusFilter);
        } else {
          toast.error(response.message || "Failed to delete category");
        }
      } catch (error) {
        toast.error("Error deleting category");
        console.error("Delete category error:", error);
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
              <h4 className="fs-18 fw-semibold m-0">Category List</h4>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-category")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-plus-square me-1"></i>
                )}
                Add Category
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
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <span className="input-group-text">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-3">
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="col-md-12 col-lg-3 d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          ) : null}
                          Apply Filters
                        </button>

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

          {/* Categories Table */}
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
                            <th>Category Image</th>
                            <th>Category Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th width="120px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.length > 0 ? (
                            categories.map((category, index) => (
                              <tr key={category.category_id}>
                                <td>{currentPage * rowsPerPage + index + 1}</td>
                                <td>
                                  {category.category_image ? (
                                    <img
                                      src={`${ImageBaseUrl}${category.category_image}`}
                                      alt={category.category_title}
                                      className="category-image"
                                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                  ) : (
                                    <div className="text-muted">No Image</div>
                                  )}
                                </td>
                                <td>{category.category_title }</td>
                                <td>
                                  {category.description || (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      category.is_active
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {category.is_active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td>
                                  {new Date(
                                    category.created_at
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() =>
                                        navigate(`/update-category`, {
                                          state: { categoryData: category },
                                        })
                                      }
                                    >
                                      <i className="mdi mdi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleDelete(category.category_id)
                                      }
                                    >
                                      <i className="mdi mdi-delete"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                No categories found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      {pageCount > 1 && (
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
                      )}
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

export default CategoryList;