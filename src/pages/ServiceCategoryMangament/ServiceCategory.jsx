import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utility/Utility";
import Swal from "sweetalert2";

function ServiceCategory() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [message, setMessage] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await postData("/category/listing", {
                search: searchTerm,
                page: currentPage + 1,
                limit: rowsPerPage,
            });

            if (response?.status && response?.data?.categories?.length > 0) {
                setUsers(response.data.categories);
                setPageCount(response.data.pagination?.totalPages || 0);
                setMessage("");
            } else {
                setUsers([]);
                setPageCount(0);
                setMessage(response?.message || "No data found.");
            }
        } catch (error) {
            setMessage("Error fetching data.");
            setUsers([]);
            setPageCount(0);
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
    };

    const handleReset = () => {
        setSearchTerm("");
        setRowsPerPage(10);
        setCurrentPage(0);
        setMessage("");
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
                await postData("/category/remove", { categoryId: id });
                toast.success("Category deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error(`Delete failed: ${error.message}`);
            }
        }
    };

    const handleEdit = (singleUserData) => {
        navigate("/Add-service-category", {
            state: { userData: singleUserData, type: "edit" },
        });
    };
    // const handleView = (user) => {
    //     navigate("/view-service-category", { state: user })
    // }
    const handleTogglePublish = async (id, newStatus) => {
        try {
            const response = await postData("category/toggleIsPublished", {
                categoryId: id,
                isPublished: newStatus,
            });

            if (response?.status) {
                toast.success("Publish status updated");
                fetchUsers(); // Refresh the list
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
                    <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                        <h4 className="fs-18 fw-semibold m-0">Category Management</h4>
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
                            Add Category
                        </button>
                    </div>

                    {/* Search and Filters */}
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
                                                        placeholder="Search..."
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
                                                        setRowsPerPage(parseInt(e.target.value));
                                                        setCurrentPage(0);
                                                    }}
                                                >
                                                    <option value={10}>Limit</option>
                                                    <option value={2}>2</option>
                                                    <option value={4}>4</option>
                                                    <option value={15}>15</option>
                                                    <option value={20}>20</option>
                                                    <option value={50}>50</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 col-lg-2">
                                                <button
                                                    className="btn btn-danger"
                                                    type="button"
                                                    onClick={handleReset}
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
                                    ) : users.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Profile</th>
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th>Joined Date</th>
                                                        <th><div className="text-center">Publish/Unpublish</div></th>
                                                        <th><div className="text-center">Actions</div></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users?.map((user) => (
                                                        <tr key={user._id}>
                                                            <td>
                                                                <img
                                                                    src={user.images?.[0]}  // Assuming images is an array, use first image for display
                                                                    alt={user.alt || "icon"}
                                                                    className="rounded-circle"
                                                                    width="40"
                                                                    height="40"
                                                                />
                                                            </td>
                                                            <td>{user.name}</td>
                                                            <td>{user.description}</td>
                                                            <td>{new Date(user.createdAt).toLocaleDateString("en-GB")}</td>
                                                            <td className="">
                                                                <div className="form-check form-switch d-flex justify-content-center">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`publishSwitch-${user._id}`}
                                                                        checked={user.isPublished}
                                                                        onChange={() => handleTogglePublish(user._id, !user.isPublished)}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`publishSwitch-${user._id}`}
                                                                        title={user.isPublished ? "Unpublish" : "Publish"}
                                                                    ></label>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <div className="d-flex gap-2 justify-content-center">
                                                                    {/* <button
                                                                        className="btn btn-sm btn-outline-info"
                                                                        onClick={() => handleView(user)}
                                                                        title="View"
                                                                    >
                                                                        <i className="mdi mdi-eye"></i>
                                                                    </button> */}

                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => handleEdit(user)}
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
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>

                                            {/* Pagination */}
                                            <div className="d-flex justify-content-center">
                                                <ReactPaginate
                                                    previousLabel={<i className="mdi mdi-chevron-left"></i>}
                                                    nextLabel={<i className="mdi mdi-chevron-right"></i>}
                                                    breakLabel="..."
                                                    pageCount={pageCount}
                                                    marginPagesDisplayed={2}
                                                    forcePage={currentPage}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageChange}
                                                    containerClassName="pagination"
                                                    activeClassName="active"
                                                    pageClassName="page-item"
                                                    pageLinkClassName="page-link"
                                                    previousClassName="page-item"
                                                    previousLinkClassName="page-link"
                                                    nextClassName="page-item"
                                                    nextLinkClassName="page-link"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <h6>{message || "No data found."}</h6>
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

export default ServiceCategory;
