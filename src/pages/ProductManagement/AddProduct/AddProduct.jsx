import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postFormData } from "../../../utility/Utility";
import PriceCalculator from "../../../Components/PriceCalculator/PriceCalculator";
import Select from "react-select";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [variations, setVariations] = useState([]);

  const [product, setProduct] = useState({
    product_name: "",
    category_id: "",
    subcategory_ids: [], // Changed to array for multiple selection
    description: "",
    prev_cost_price: "",
  });

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, subCatRes] = await Promise.all([
          getData("api/category/get-all"),
          getData("api/sub-category/get-all"),
        ]);

        if (catRes?.success) setCategories(catRes.results || []);
        if (subCatRes?.success) setSubcategories(subCatRes.results || []);
      } catch (error) {
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category_id" && { subcategory_ids: [] }), // Reset subcategories when category changes
    }));
  };

  // Handle subcategory selection change
  const handleSubcategoryChange = (selectedOptions) => {
    setProduct((prev) => ({
      ...prev,
      subcategory_ids: selectedOptions.map((option) => option.value),
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(
          `File ${file.name} is not a supported image type (JPEG, PNG, WEBP)`
        );
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImagePreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    setImageFiles((prev) => [...prev, ...validFiles]);

    // Reset file input
    e.target.value = "";
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!product.category_id) {
        throw new Error("Please select a category");
      }
      if (product.subcategory_ids.length === 0) {
        throw new Error("Please select at least one subcategory");
      }
      if (imageFiles.length === 0) {
        throw new Error("Please upload at least one product image");
      }

      const formData = new FormData();

      // Append text fields
      formData.append("product_name", product.product_name);
      formData.append("prev_cost_price", product.prev_cost_price);
      formData.append("category_id", product.category_id);
      formData.append(
        "subcategory_id",
        JSON.stringify(product.subcategory_ids)
      );
      formData.append("description", product.description);

      // Append price variations
      formData.append("product_price", JSON.stringify(variations));

      // Append all image files
      imageFiles.forEach((file) => {
        formData.append("product_images", file);
      });

      const response = await postFormData("api/product/create", formData);

      if (response?.success) {
        toast.success("Product added successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/product-list"),
        });
      } else {
        throw new Error(response?.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(error.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  // Get filtered subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat?.category?.category_id === product.category_id
  );

  // Prepare options for react-select
  const subcategoryOptions = filteredSubcategories.map((subcat) => ({
    value: subcat.subcategory_id,
    label: subcat.subcategory_title,
  }));

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Add New Product</h4>
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
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Product Name */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Product Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="product_name"
                            placeholder="Enter product name"
                            value={product.product_name}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Product Price*</label>
                          <input
                            type="number"
                            className="form-control"
                            name="prev_cost_price"
                            placeholder="Enter product base price"
                            value={product.prev_cost_price}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            min={0}
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Category*</label>
                          <select
                            className="form-control"
                            name="category_id"
                            value={product.category_id}
                            onChange={handleInputChange}
                            required
                            disabled={loading || categories.length === 0}
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option
                                key={category.category_id}
                                value={category.category_id}
                              >
                                {category.category_title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Subcategory - Multi-select */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Subcategories*</label>
                          <Select
                            isMulti
                            options={subcategoryOptions}
                            value={subcategoryOptions.filter((option) =>
                              product.subcategory_ids.includes(option.value)
                            )}
                            onChange={handleSubcategoryChange}
                            isDisabled={loading || !product.category_id}
                            placeholder="Select subcategories..."
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Product Images*</label>
                          {imagePreviews.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2 my-3 ">
                              {imagePreviews.map((preview, index) => (
                                <div
                                  key={index}
                                  className="position-relative mx-2"
                                  style={{ width: "100px" }}
                                >
                                  <img
                                    src={preview}
                                    alt={`Product Preview ${index + 1}`}
                                    className="img-thumbnail"
                                    style={{
                                      width: "100%",
                                      height: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={() => removeImage(index)}
                                    disabled={loading}
                                    style={{
                                      transform: "translate(50%, -50%)",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          <div className="file-input-container">
                            <input
                              type="file"
                              id="productImageInput"
                              accept="image/*"
                              onChange={handleImageChange}
                              disabled={loading || imageFiles.length >= 5}
                              className="form-control"
                              multiple
                            />
                            <small className="text-muted">
                              {imageFiles.length}/5 images (JPEG, PNG, WEBP, Max
                              5MB each)
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            name="description"
                            rows="4"
                            placeholder="Enter product description"
                            value={product.description}
                            onChange={handleInputChange}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* <PriceCalculator
                        variations={variations}
                        setVariations={setVariations}
                      /> */}
                    </div>

                    <div className="text-end mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate("/product-list")}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                          loading ||
                          imageFiles.length === 0 ||
                          product.subcategory_ids.length === 0
                        }
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Adding...
                          </>
                        ) : (
                          "Add Product"
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

export default AddProduct;
