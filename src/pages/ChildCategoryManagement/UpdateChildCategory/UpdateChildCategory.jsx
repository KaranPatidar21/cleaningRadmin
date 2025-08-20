import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, putFormData } from "../../../utility/Utility";

export default function UpdateChildCategory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    subcategory_title: "",
    description: "",
    subcategory_image: null,
    slug: "",
    category_id: "",
    is_active: true,
  });

  // Fetch categories when component mounts
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const categoriesResponse = await getData("api/category/get-all");
      if (categoriesResponse?.success) {
        setCategories(categoriesResponse?.results || []);
      } else {
        throw new Error(categoriesResponse?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error loading data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Set form data when state is available
  useEffect(() => {
    if (state?.categoryData) {
      const { 
        subcategory_title, 
        description, 
        subcategory_image, 
        slug, 
        is_active, 
        category_id 
      } = state.categoryData;
      
      setFormData({
        subcategory_title,
        description,
        subcategory_image,
        slug,
        category_id,
        is_active,
      });
      
      if (subcategory_image) {
        setImagePreview(subcategory_image);
      }
    }
  }, [state]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "subcategory_image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.category_id) {
        throw new Error("Please select a category");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("subcategory_title", formData.subcategory_title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("is_active", formData.is_active);

      // Only append image if it's a new file
      if (formData.subcategory_image instanceof File) {
        formDataToSend.append("subcategory_image", formData.subcategory_image);
      }

      const response = await putFormData(
        `api/sub-category/update/${state?.categoryData?.subcategory_id}`,
        formDataToSend
      );

      if (response?.success) {
        toast.success("Subcategory updated successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/subcategory-list"),
        });
      } else {
        throw new Error(response?.message || "Failed to update subcategory");
      }
    } catch (error) {
      console.error("Update subcategory error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error updating subcategory"
      );
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
              <h4 className="fs-18 fw-semibold m-0">Update Subcategory</h4>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Back
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Subcategory Details</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                      {/* Category Dropdown */}
                      <div className="col-md-3">
                        <label htmlFor="category_id" className="form-label">
                          Parent Category*
                        </label>
                      </div>
                      <div className="col-md-6">
                        <select
                          id="category_id"
                          name="category_id"
                          className="form-control"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          required
                          disabled={loading || categories.length === 0}
                        >
                          <option value="">Select a category</option>
                          {categories?.map((category) => (
                            <option
                              key={category.category_id}
                              value={category.category_id}
                            >
                              {category.category_title}
                            </option>
                          ))}
                        </select>
                        {loading && categories.length === 0 && (
                          <small className="text-muted">
                            Loading categories...
                          </small>
                        )}
                        {!loading && categories.length === 0 && (
                          <small className="text-danger">
                            No categories available.
                          </small>
                        )}
                      </div>
                      <div className="col-md-3"></div>

                      {/* Subcategory Title */}
                      <div className="col-md-3">
                        <label htmlFor="subcategory_title" className="form-label">
                          Subcategory Title*
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="subcategory_title"
                          name="subcategory_title"
                          className="form-control"
                          placeholder="Enter subcategory title"
                          value={formData.subcategory_title}
                          onChange={handleInputChange}
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                      <div className="col-md-3"></div>

                      {/* Slug */}
                      <div className="col-md-3">
                        <label htmlFor="slug" className="form-label">
                          Slug*
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          className="form-control"
                          placeholder="Enter slug (e.g., gaming-laptops)"
                          value={formData.slug}
                          onChange={handleInputChange}
                          required
                          pattern="[a-z0-9-]+"
                          title="Only lowercase letters, numbers and hyphens allowed"
                        />
                      </div>
                      <div className="col-md-3"></div>

                      {/* Subcategory Image */}
                      <div className="col-md-3">
                        <label htmlFor="subcategory_image" className="form-label">
                          Subcategory Image
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="file"
                          id="subcategory_image"
                          name="subcategory_image"
                          className="form-control"
                          onChange={handleInputChange}
                          accept="image/*"
                        />
                        <small className="text-muted">
                          Recommended size: 800x600px, Max size: 2MB
                        </small>
                        {imagePreview && (
                          <div className="mt-2">
                            <img
                              src={imagePreview}
                              alt="Subcategory Preview"
                              className="img-thumbnail"
                              style={{ maxWidth: "200px" }}
                            />
                            <small className="d-block text-muted mt-1">
                              Current image
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="col-md-3"></div>

                      {/* Status Toggle */}
                      <div className="col-md-3">
                        <label className="form-label">Status</label>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                is_active: !prev.is_active,
                              }))
                            }
                            role="switch"
                          />
                          <label className="form-check-label" htmlFor="is_active">
                            {formData.is_active ? (
                              <span className="text-success">Active</span>
                            ) : (
                              <span className="text-secondary">Inactive</span>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3"></div>

                      {/* Description */}
                      <div className="col-md-3">
                        <label htmlFor="description" className="form-label">
                          Description*
                        </label>
                      </div>
                      <div className="col-md-9">
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows={5}
                          placeholder="Enter subcategory description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          minLength={10}
                        />
                      </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || categories.length === 0}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          "Update Subcategory"
                        )}
                      </button>
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