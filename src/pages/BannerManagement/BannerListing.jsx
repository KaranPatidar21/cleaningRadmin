import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { postData } from "../../utility/Utility";
import { Pagination, Stack } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

function BannerListing() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await postData("banner/listing", {
        search: searchTerm,
        page: currentPage,
        limit: rowsPerPage,
      });
      if (res.status) {
        setBanners(res?.data?.banners || []);
        setPageCount(res?.data?.pagination?.totalPages);
      }
    } catch (error) {
      setBanners([]);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [searchTerm, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setRowsPerPage(10);
    setCurrentPage(1);
  };
  const handleCloseModal = () => {
  setShowModal(false);
  setSelectedImage(null);
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
        await postData(`/banner/delete/${id}`);
        toast.success("Banner deleted successfully");
        fetchBanners();
      } catch (error) {
        toast.error("Error deleting banner");
      }
    }
  };


  const handleView = (banner) => {
    setSelectedImage(banner.image); 
    setShowModal(true);
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Banner Management</h4>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/Add-banner")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-account-plus me-1"></i>
                )}
                Add Banner
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                      <div className="col-md-12 col-lg-4">
                        <h4 className="fs-18 fw-semibold m-0">All Banners</h4>
                      </div>

                      <div className="col-md-12 col-lg-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control ps-4"
                            placeholder="Search banners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                          onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                          }
                        >
                          <option value={10}>Limit</option>
                          <option value={5}>5</option>
                          <option value={2}>2</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                      </div>

                      <div className="col-md-12 col-lg-2 d-flex gap-2">
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
                            <th>Image</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th width="180px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {banners?.length > 0 ? (
                            banners?.map((banner) => (
                              <tr key={banner?.id}>
                                <td>
                                  <img
                                    src={banner?.image}
                                    alt={banner?.title}
                                    className="rounded-circle"
                                    width="40"
                                    height="40"
                                  />
                                </td>
                                <td>{banner?.title}</td>
                                <td>{banner?.description}</td>
                                <td>{banner?.type}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleView(banner)}
                                      title="View"
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() =>
                                        navigate("/add-banner", {
                                          state: { banner: banner },
                                        })
                                      }
                                      title="Edit"
                                    >
                                      <i className="mdi mdi-pencil"></i>
                                    </button>

                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(banner?._id)}
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
                              <td colSpan="5" className="text-center py-4">
                                No banners found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="pagination d-flex justify-content-center align-items-center gap-2 mt-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Previous
                        </button>

                        <div
                          className="d-flex overflow-auto px-2"
                          style={{ maxWidth: "250px", gap: "6px" }}
                        >
                          {[...Array(pageCount)].map((_, i) => (
                            <button
                              key={i}
                              className={`btn btn-sm ${currentPage === i + 1
                                ? "btn-primary text-white"
                                : "btn-outline-secondary"
                                }`}
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          disabled={currentPage === pageCount}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                 
                  {showModal && (
                    <div
                      className="modal fade show"
                      tabIndex="-1"
                      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
                      onClick={handleCloseModal}
                    >
                      <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="modal-content">
                          <div className="modal-header bg-light">
                            <h5 className="modal-title">Banner Preview</h5>
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                              onClick={handleCloseModal}
                            ></button>
                          </div>
                          <div className="modal-body text-center">
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: "450px", objectFit: "contain" }}
                            />
                          </div>
                        </div>
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

export default BannerListing;
