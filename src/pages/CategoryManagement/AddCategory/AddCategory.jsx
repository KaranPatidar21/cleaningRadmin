import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postFormData,ImageBaseUrl } from "../../../utility/Utility";

export default function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryTitle: "",
    description: "",
    categoryImage: null,
    slug: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "categoryImage") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleActive = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("category_title", formData.categoryTitle);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("is_active", formData.isActive);
      if (formData.categoryImage) {
        formDataToSend.append("category_image", formData.categoryImage);
      }

      const response = await postFormData(
        "/api/category/create",
        formDataToSend
      );

      if (response.success) {
        toast.success("Category added successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/category-list"),
        });
      } else {
        toast.error(response.message || "Failed to add category");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Error adding category"
        );
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Add category error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <div className="page-title-box">
                <h4 className="mb-1">Category Management</h4>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">Category</li>
                  <li className="breadcrumb-item active">Create Category</li>
                </ol>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Create New Category</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Category Title */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="categoryTitle" className="form-label fw-medium">
                          Category Title <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="categoryTitle"
                          name="categoryTitle"
                          className="form-control"
                          placeholder="Enter category title"
                          value={formData.categoryTitle}
                          onChange={handleInputChange}
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="slug" className="form-label fw-medium">
                          Slug <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          className="form-control"
                          placeholder="Enter slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          required
                          pattern="[a-z0-9-]+"
                          title="Only lowercase letters, numbers and hyphens allowed"
                        />
                        <small className="text-muted">URL-friendly identifier</small>
                      </div>
                    </div>

                    {/* Category Image */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="categoryImage" className="form-label fw-medium">
                          Category Image <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="file"
                          id="categoryImage"
                          name="categoryImage"
                          className="form-control"
                          onChange={handleInputChange}
                          accept="image/*"
                          required
                        />
                        <small className="text-muted d-block mt-1">
                          Recommended: 800x600px, Max 2MB (JPEG/PNG)
                        </small>
                        {formData.categoryImage && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(formData.categoryImage)}
                              alt="Preview"
                              className="img-thumbnail"
                              style={{ maxWidth: "200px", maxHeight: "150px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label className="form-label fw-medium">Status</label>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-switch d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={toggleActive}
                            role="switch"
                            style={{ width: "2.5em", height: "1.25em" }}
                          />
                          <label className="form-check-label ms-2" htmlFor="isActive">
                            {formData.isActive ? (
                              <span className="text-success">Active</span>
                            ) : (
                              <span className="text-muted">Inactive</span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label htmlFor="description" className="form-label fw-medium">
                          Description <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows={4}
                          placeholder="Describe the category..."
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          minLength={10}
                        />
                        <small className="text-muted">Minimum 10 characters</small>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="row mt-4">
                      <div className="col-md-6 offset-md-3">
                        <button
                          type="submit"
                          className="btn btn-primary  py-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Processing...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}