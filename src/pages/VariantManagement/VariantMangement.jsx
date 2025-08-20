
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ReactPaginate from "react-paginate";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import { RiH6 } from "react-icons/ri";
// import { postData } from "../../utility/Utility";

// function VariantMangement() {
//     const navigate = useNavigate();
//     const [variant, setVariants] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     // const [statusFilter, setStatusFilter] = useState("all");
//     const [currentPage, setCurrentPage] = useState(0);
//     const [pageCount, setPageCount] = useState(0);
//     const [limit, setLimit] = useState(10);
//     const [message, setMessage] = useState("")
//     const [unitType, setUnitType] = useState("");
//     const [units, setUnits] = useState("");

//     const fetchVariants = async () => {
//         setLoading(true);
//         try {
//             const response = await postData("/variant/listing", {
//                 limit: limit,
//                 page: currentPage + 1,
//                 search: searchTerm,
//             });

//             console.log(response, "shivam");

//             if (response.status) {
//                 setVariants(response.data);
//                 setMessage("");
//             } else {
//                 setMessage(response.message);
//             }
//         } catch (error) {
//             toast.error("Error fetching variants");
//         }
//         setLoading(false);
//     };


//     useEffect(() => {
//         fetchVariants();
//     },[]);
//     // }, [currentPage, limit, searchTerm]);

//     // Handle page change
//     const handlePageChange = ({ selected }) => {
//         setCurrentPage(selected);
//     };

//     // Handle form submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await postData("/variant/create", {
//                 unitType: unitType,
//                 units: units
//             });

//             if (response.status) {
//                 toast.success("Variant added successfully!");
//                 fetchVariants();
//                 setUnitType("");
//                 setUnits("");
//             } else {
//                 toast.error(response.message || "Failed to add variant");
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Error adding variant");
//         }
//     };

//     // Delete variant
//     const handleDelete = async (id) => {
//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You won't be able to revert this!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it!",
//         });

//         if (result.isConfirmed) {
//             try {
//                 const response = await postData(`/variant/remove/${id}`);
//                 if (response.status) {
//                     toast.success("Variant deleted successfully");
//                     fetchVariants();
//                 } else {
//                     toast.error(response.message || "Failed to delete variant");
//                 }
//             } catch (error) {
//                 toast.error("Error deleting variant");
//             }
//         }
//     };
    
//     return (
//         <div className="content-page">
//             <ToastContainer position="top-right" autoClose={3000} />
//             <div className="content">
//                 <div className="container-fluid">
//                     {/* Header Section */}
//                     <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
//                         <h4 className="fs-18 fw-semibold m-0">Variant Management</h4>

//                     </div>

//                     {/* Filters */}
//                     <div className="card mb-3">
//                         <div className="card-body">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="row g-3">
//                                     <div className="col-md-3">
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Variant type..."
//                                             value={unitType}
//                                             onChange={(e) => setUnitType(e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-2">
//                                         <input
//                                             type="number"
//                                             className="form-control"
//                                             placeholder="Units..."
//                                             value={units}
//                                             onChange={(e) => setUnits(e.target.value)}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-4 d-flex gap-2">
//                                         <button type="submit" className="btn btn-primary">
//                                             Add Variant
//                                         </button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* SubCategory Table */}
//                     <div className="card">
//                         <div className="card-body">
//                             {loading ? (
//                                 <div className="text-center py-5">
//                                     <div className="spinner-border text-primary" role="status"></div>
//                                 </div>
//                             ) : (
//                                 <div className="table-responsive">
//                                     <table className="table table-hover">
//                                         <thead>
//                                             <tr>
//                                                 <th>S.No</th>
//                                                 <th>Variant Type</th>
//                                                 <th> Units</th>
//                                                 <th>Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {message === "" ? <>

//                                                 {variant?.map((item, index) => (
//                                                     <tr key={item._id}>
//                                                         <td>{index + 1 + currentPage * limit}</td>
//                                                         <td>{item.unitType}</td>
//                                                         <td>{item.units}</td>

//                                                         <td>
//                                                             <div className="d-flex gap-2">
//                                                                 {/* <button
//                                                                     className="btn btn-sm btn-outline-primary"
//                                                                     onClick={() => handleUpdateVariant(item._id)}
//                                                                 >
//                                                                     <i className="mdi mdi-pencil"></i>
//                                                                 </button> */}
//                                                                 <button
//                                                                     className="btn btn-sm btn-outline-danger"
//                                                                     onClick={() => handleDelete(item._id)}
//                                                                 >
//                                                                     <i className="mdi mdi-delete"></i>
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))}</> : <h6>{message}</h6>}

//                                         </tbody>
//                                     </table>

//                                     {/* Pagination */}
//                                     <div className="d-flex justify-content-center">

//                                         <ReactPaginate
//                                             previousLabel={<i className="mdi mdi-chevron-left"></i>}
//                                             nextLabel={<i className="mdi mdi-chevron-right"></i>}
//                                             breakLabel="..."
//                                             pageCount={pageCount}
//                                             onPageChange={handlePageChange}
//                                             containerClassName="pagination pagination-rounded justify-content-end mt-3"
//                                             pageClassName="page-item"
//                                             pageLinkClassName="page-link"
//                                             previousClassName="page-item"
//                                             previousLinkClassName="page-link"
//                                             nextClassName="page-item"
//                                             nextLinkClassName="page-link"
//                                             activeClassName="active"
//                                             forcePage={currentPage}
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default VariantMangement;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { postData } from "../../utility/Utility";

function VariantMangement() {
    const navigate = useNavigate();
    const [variant, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [message, setMessage] = useState("");
    const [unitType, setUnitType] = useState("");
    const [units, setUnits] = useState("");


    const [editId, setEditId] = useState(null);

    const fetchVariants = async () => {
        setLoading(true);
        try {
            const response = await postData("/variant/listing", {
                limit: limit,
                page: currentPage + 1,
                search: searchTerm,
            });

            if (response.status) {
                setVariants(response.data);
                setMessage("");
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            toast.error("Error fetching variants");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVariants();
    }, []);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // UPDATE
                const response = await postData(`/variant/update/${editId}`, {
                    unitType: unitType,
                    units: units
                });

                if (response.status) {
                    toast.success("Variant updated successfully!");
                    fetchVariants();
                    setUnitType("");
                    setUnits("");
                    setEditId(null);
                } else {
                    toast.error(response.message || "Failed to update variant");
                }
            } else {
                // ADD
                const response = await postData("/variant/create", {
                    unitType: unitType,
                    units: units
                });

                if (response.status) {
                    toast.success("Variant added successfully!");
                    fetchVariants();
                    setUnitType("");
                    setUnits("");
                } else {
                    toast.error(response.message || "Failed to add variant");
                }
            }
        } catch (error) {
            toast.error("Error saving variant");
        }
    };

    // NEW: populate form when editing
    const handleUpdateVariant = (id) => {
        const selected = variant.find((item) => item._id === id);
        if (selected) {
            setUnitType(selected.unitType);
            setUnits(selected.units);
            setEditId(id);
        }
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
                const response = await postData(`/variant/remove/${id}`);
                if (response.status) {
                    toast.success("Variant deleted successfully");
                    fetchVariants();
                } else {
                    toast.error(response.message || "Failed to delete variant");
                }
            } catch (error) {
                toast.error("Error deleting variant");
            }
        }
    };

    return (
        <div className="content-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                        <h4 className="fs-18 fw-semibold m-0">Variant Management</h4>
                    </div>

                    {/* Form */}
                    <div className="card mb-3">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Variant type..."
                                            value={unitType}
                                            onChange={(e) => setUnitType(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Units..."
                                            value={units}
                                            onChange={(e) => setUnits(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 d-flex gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            {editId ? "Update Variant" : "Add Variant"}
                                        </button>
                                        {editId && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setUnitType("");
                                                    setUnits("");
                                                    setEditId(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table */}
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
                                                <th>Variant Type</th>
                                                <th>Units</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {message === "" ? (
                                                <>
                                                    {variant?.map((item, index) => (
                                                        <tr key={item._id}>
                                                            <td>{index + 1 + currentPage * limit}</td>
                                                            <td>{item.unitType}</td>
                                                            <td>{item.units}</td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => handleUpdateVariant(item._id)}
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
                                                    ))}
                                                </>
                                            ) : (
                                                <h6>{message}</h6>
                                            )}
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

export default VariantMangement;
