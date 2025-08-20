import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utility/Utility";
import Swal from "sweetalert2";

function ClickAndView() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPagecount] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [status, setStatus] = useState(null)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await postData("/activity/list", {
                page: currentPage + 1,
                limit: rowsPerPage
            })
            setStatus(response.status)
            if (response.status) {
                setPagecount(response.data.pagination.totalPages)
                setUsers(response.data.activities);
            } else {
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
        fetchUsers();
    }, [currentPage, rowsPerPage]);

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
      
        setRowsPerPage(10);
        setCurrentPage(0);
        fetchUsers();
        setmessage("")
    };


    const handleDelete = async (id) => {
        const result =
            await Swal.fire({
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
                const response = await postData(`/activity/remove/${id}`);
                toast.dismiss()
                toast.success(response.message);
                fetchUsers();
            } catch (error) {
                console.error("Delete error:", error);
                toast.error(`Delete failed: ${error.message}`);
            }
        }
    };
    const setRowsPerPageFunction = (limitCount) => {
        setRowsPerPage(limitCount)
        setCurrentPage(0)
    }
    // const handleEdit = (SingleuserData) => {
    //     console.log(SingleuserData);
    //     const type = "edit"
    //     navigate("/Add-service-category", { state: { userData: SingleuserData, type } });
    // };
    return (
        <div className="content-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                        <div className="flex-grow-1">
                            <h4 className="fs-18 fw-semibold m-0">Click and View Management </h4>
                        </div>
                        {/* <div>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/Add-service-category")}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                ) : (
                                    <i className="mdi mdi-account-plus me-1"></i>
                                )}
                                Add Service Category
                            </button>

                        </div> */}
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3 align-items-center">
                                            {/* <div className="col-md-12 col-lg-4">
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
                                            </div> */}
                                            <div className="col-md-12 col-lg-2">
                                                <select
                                                    className="form-select"
                                                    value={rowsPerPage}
                                                    onChange={(e) => setRowsPerPageFunction(parseInt(e.target.value))}
                                                >
                                                    <option value={10}>Limit</option>
                                                    <option value={2}>2</option>
                                                    <option value={4}>4 </option>
                                                    <option value={15}>15 </option>
                                                    <option value={20}>20 </option>
                                                    <option value={50}>50 </option>
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
                                                    {/* <tr>
                                                        <th>Profile</th>
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th>Selling Type</th>
                                                        <th>Size</th>
                                                        <th>Price</th>
                                                        <th>Seat</th>
                                                        <th>Joined Date</th>
                                                        <th>Actions</th>
                                                    </tr> */}
                                                    <tr>
                                                        <th>User Name</th>
                                                        <th>User Email</th>
                                                        <th>Activity Date</th>
                                                        <th>Activity</th>
                                                        <th>Purpose</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user) => (
                                                        // <tr key={user.id}>
                                                        //     <td>
                                                        //         <img
                                                        //             src={user.icon}
                                                        //             alt={user.alt}
                                                        //             className="rounded-circle"
                                                        //             width="40"
                                                        //             height="40"
                                                        //         />
                                                        //     </td>
                                                        //     <td>{user.name}</td>
                                                        //     <td>{user.description}</td>
                                                        //     <td>{user.sellingType}</td>
                                                        //     <td>{user.size}</td>
                                                        //     <td>{user.price}</td>
                                                        //     <td>{user.seat}</td>
                                                        //     <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                                                        //     <td>
                                                        //         <div className="d-flex gap-2">
                                                        //             <button
                                                        //                 className="btn btn-sm btn-outline-primary"
                                                        //                 onClick={() => handleEdit(user)}
                                                        //                 title="Edit"
                                                        //             >
                                                        //                 <i className="mdi mdi-pencil"></i>
                                                        //             </button>
                                                        //             <button
                                                        //                 className="btn btn-sm btn-outline-danger"
                                                        //                 onClick={() => handleDelete(user._id)}
                                                        //                 title="Delete"
                                                        //             >
                                                        //                 <i className="mdi mdi-delete"></i>
                                                        //             </button>

                                                        //         </div>
                                                        //     </td>
                                                        // </tr>
                                                        <tr key={user.id}>
                                                            <td>{user.userId.name}</td>
                                                            <td>{user.userId.email}</td>
                                                            <td>{new Date(user.activityDate).toLocaleDateString('en-GB')}</td>
                                                            <td>{user.activity}</td>
                                                            <td>{user.purpose}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(user._id)}
                                                                    title="Delete"
                                                                >
                                                                    <i className="mdi mdi-delete"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {/* <div className="pagination d-flex justify-content-center align-items-center gap-2 mt-3">
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
                                                            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary text-white" : "btn-outline-secondary"}`}
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
                                            </div> */}
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
                                </div> : <>
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

export default ClickAndView;