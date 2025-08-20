import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { postData } from "../../utility/Utility";

function OfferManagement() {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await postData("/offer/listingOffer", {
                search: searchTerm,
                page: currentPage,
                limit: rowsPerPage,
            });
            if (res.status) {
                setOffers(res?.data?.offers || []);
                // (res?.totalPages);
                setPageCount(res?.data?.totalPages, ":totalPages")
            } else {
                setOffers([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [searchTerm, currentPage, rowsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

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
                const res = await postData(`/offer/removeOffer/${id}`);
                if (res.status) {
                    toast.success("Offer deleted successfully");
                    fetchOffers();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Error deleting offer");
            }
        }
    };

    return (
        <div className="content-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex justify-content-between align-items-center">
                        <h4 className="fs-18 fw-semibold m-0">Offer Management</h4>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/Add-Offer")}
                            disabled={loading}
                        >
                            <i className="mdi mdi-plus me-1"></i> Add Offer
                        </button>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="row g-3 align-items-center">
                                <div className="col-md-12 col-lg-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search offers..."
                                        value={searchTerm}
                                        onChange={(e) => (setSearchTerm(e.target.value), setCurrentPage(1))}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-2">
                                    <select
                                        className="form-select"
                                        value={rowsPerPage}
                                        onChange={(e) => (setRowsPerPage(Number(e.target.value)), setCurrentPage(1))}
                                    >
                                        <option value={10}>Limit</option>
                                        <option value={1}>1</option>
                                        <option value={20}>20</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
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
                                                {/* <th>Start Date</th> */}
                                                {/* <th>End Date</th> */}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {offers.length > 0 ? (
                                                offers?.map((offer) => (
                                                    <tr key={offer._id}>
                                                        <td>
                                                            <img
                                                                src={offer.image}
                                                                alt={offer.title}
                                                                width="50"
                                                                height="50"
                                                                style={{ borderRadius: "6px", objectFit: "cover" }}
                                                            />
                                                        </td>
                                                        <td>{offer.title}</td>
                                                        {/* <td>{offer.startDate}</td> */}
                                                        {/* <td>{offer.endDate}</td> */}
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(offer._id)}
                                                            >
                                                                <i className="mdi mdi-delete"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-4">
                                                        No offers found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                   <div className="pagination d-flex justify-content-center align-items-center gap-2 mt-3">
  <button
    className="btn btn-outline-primary btn-sm"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <div className="d-flex flex-wrap justify-content-center px-2" style={{ gap: "6px" }}>
    {[...Array(pageCount || 0)].map((_, i) => (
      <button
        key={i}
        className={`btn btn-sm ${currentPage === i + 1
          ? "btn-primary text-white"
          : "btn-outline-secondary"
          }`}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}
  </div>

  <button
    className="btn btn-outline-primary btn-sm"
    disabled={currentPage === pageCount}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
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

export default OfferManagement;
