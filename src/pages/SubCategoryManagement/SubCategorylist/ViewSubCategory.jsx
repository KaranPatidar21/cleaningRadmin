import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewSubCategory() {
    const location = useLocation();
    const navigate = useNavigate();
    const subCategoryData = location.state?.subCategoryData;
    
    if (!subCategoryData) {
        return (
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-12">
                                <div className="card">
                                    <div className="card-body text-center p-5">
                                        <div className="alert alert-warning mb-4">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            Subcategory data not found. Please select a subcategory.
                                        </div>
                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => navigate("/sub-category-management")}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to Subcategory List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="content-page">
            <ToastContainer />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h4 className="mb-0">Subcategory Details</h4>
                            <small className="text-muted">{subCategoryData.name}</small>
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(-1)}
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">
                                <i className="fas fa-info-circle me-2"></i>Subcategory Information
                            </h5>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item px-0 py-2"><strong>Name:</strong> {subCategoryData.name}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Description:</strong> {subCategoryData.description || "N/A"}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Category:</strong> {subCategoryData.categoryId?.name || "N/A"}</li>
                                        <li className="list-group-item px-0 py-2"><strong>Published:</strong> {subCategoryData.isPublished ? "Yes" : "No"}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {subCategoryData.images && subCategoryData.images.length > 0 && (
                        <div className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">Subcategory Images</h5>
                                <div className="d-flex flex-wrap gap-3">
                                    {subCategoryData.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Subcategory ${idx + 1}`}
                                            className="img-fluid rounded"
                                            style={{ maxWidth: "200px", height: "auto" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewSubCategory;
