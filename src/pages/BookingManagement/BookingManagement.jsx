import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utility/Utility";
import PartnerListingModal from "./BookingManagementList/PartnerListingModal"; // ✅ Import the modal
import ReactPaginate from "react-paginate";

export default function BookingManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, settotalPages] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const openModal = (orderId) => {
    setSelectedBookingId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewBookingDetails = (order) => {
    navigate("/booking-details", { state: { order } });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const requestData = {
        search: searchTerm,
        page: currentPage + 1,
        limit: rowsPerPage,
        bookingStatus: "",
      };

      const response = await postData("/booking/bookingListing", requestData);
      if (response.status) {
        setOrders(response?.data?.bookings || []);
        settotalPages(response.data.totalPages)
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, rowsPerPage, isModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(0);
    setRowsPerPage(10);
    fetchOrders();
  };
  const handleAssignPartner = (orderId) => {
    openModal(orderId);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <h4 className="fs-18 fw-semibold m-0">Booking Management</h4>
          </div>

          {/* Search Section */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                      <div className="col-lg-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control ps-4"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value), setCurrentPage(0) }}
                          />
                          <span className="input-group-text">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </div>
                      </div>

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

                      <div className="col-lg-3 d-flex gap-2">
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

          {/* Table Section */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="card">
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
                            <th>User Name</th>
                            <th>User Email</th>
                            {/* <th>Service</th> */}
                            {/* <th>Partner</th> */}
                            <th>Booking Date</th>
                            <th>Payment Status</th>
                            <th>Booking Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders?.length > 0 ? (
                            orders?.map((order) => (
                              <tr key={order?._id}>
                                <td>{order?.user?.name}</td>
                                <td>{order?.user?.email}</td>
                                {/* <td>{order?.partner?.name || "Not Assigned"}</td> */}
                                {/* <td>{order?.assignedPartners[0]?.partner?.name}</td> */}
                                
                                {/* <td>{new Date(order?.date).toLocaleDateString()}</td> */}
                                <td>
                                  {order?.date
                                    ? new Date(order?.date).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })
                                    : 'N/A'}
                                </td>

                                <td>{order?.paymentStatus}</td>
                                <td>{order.bookingStatus}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleViewBookingDetails(order)}
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleAssignPartner(order?._id)}
                                    >
                                      Manual Partner Assign
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                No orders found
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
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          pageCount={totalPages}
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Modal Integration */}
          <PartnerListingModal
            isOpen={isModalOpen}
            onClose={closeModal}
            selectedBookingId={selectedBookingId}
          />
        </div>
      </div>
    </div>
  );
}
