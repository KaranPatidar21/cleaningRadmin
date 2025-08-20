import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utility/Utility";
import Swal from "sweetalert2";

function ProductPriceManagemet() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPagecount] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [status, setStatus] = useState(null)
    const [bookingStatus ,setBookingStatus] = useState("")
    const [paymentStatus , setPaymentStatus] = useState("")

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await postData("/payment/paymentListing", {
                search: searchTerm,
                page: currentPage + 1,
                limit: rowsPerPage,
                bookingStatus:bookingStatus,
                paymentStatus:paymentStatus
            })
            setStatus(response.status)
            if(response.status){
                setPayments(response.data.bookings);
                setPagecount(response.data.totalPages)
            }else{
                // setmessage(response.message)
            }
        } catch (error) {
            toast.dismiss()
            toast.error("Error fetching users");
            console.error("Fetch users error:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPayments();
    }, [currentPage, searchTerm, rowsPerPage, bookingStatus, paymentStatus]);
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0); 
    };

    // Reset all filters
    const handleReset = () => {
        setSearchTerm("");
        setRowsPerPage(10);
        setCurrentPage(0);
        // setmessage("") 
        setBookingStatus("")
        setPaymentStatus("")
        fetchPayments();
      };
    const setRowsPerPageFunction = (limitCount) => {
        setRowsPerPage(limitCount)
        setCurrentPage(0)
    }
    return (
        <div className="content-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                        <div className="flex-grow-1">
                            <h4 className="fs-18 fw-semibold m-0">Payment Management </h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-12 col-lg-2">
                                                <select
                                                    className="form-select"
                                                    value={rowsPerPage}
                                                    onChange={(e) => setRowsPerPageFunction(parseInt(e.target.value))}
                                                >
                                                    <option value={10}>Limit</option>
                                                    <option value={1}>1</option>
                                                    <option value={4}>4 </option>
                                                    <option value={15}>15 </option>
                                                    <option value={20}>20 </option>
                                                    <option value={50}>50 </option>
                                                </select>
                                            </div>
                                             <div className="col-md-12 col-lg-2">
                                                <select
                                                    className="form-select"
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value) }
                                                >
                                                    <option value="">Payment status</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="failed">Failed</option>
                                                    <option value="pending ">Pending</option>
                                                </select>
                                            </div>
                                             <div className="col-md-12 col-lg-2">
                                                <select
                                                    className="form-select"
                                                    value={bookingStatus}
                                                    onChange={(e) => setBookingStatus(e.target.value) }
                                                >
                                                    <option value="">Booking Status</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Progress">Progress</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 col-lg-2">
                                                <button className="btn btn-danger" onClick={handleReset}>Reset</button>
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

                                {status ? <div className="card-body">
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
                                                      <th>Booking status</th>
                                                      <th>Payment Status</th>
                                                      <th>Order Id</th>
                                                      <th>Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.length > 0 ? <>
                                                     {payments.map((item) => (
                                                        <tr key={item.id}>
                                                          <td>{item.bookingStatus}</td>
                                                          <td>{item.paymentStatus}</td>
                                                          <td>{item.cashfreeOrderId}</td>
                                                          <td>{item.totalPrice}</td>
                                                        </tr>
                                                    ))}
                                                    </> : <> <h6 className="pt-3 ps-1">No Bookings Found</h6></> }
                                                   
                                                </tbody>
                                            </table>
                                            <div className="d-flex justify-content-center">
                                                <ReactPaginate
                                                    previousLabel={<i className="mdi mdi-chevron-left"></i>}
                                                    nextLabel={<i className="mdi mdi-chevron-right"></i>}
                                                    breakLabel="..."
                                                    breakClassName="page-item"
                                                    breakLinkClassName="page-link"
                                                    pageCount={pageCount} // from backend totalPages
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
                                </div> :  <>
                                    <h6 className="p-2 text-center">No Such Category found!</h6>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPriceManagemet;