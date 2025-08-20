import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getData,
  postFormData,
  putFormData,
  ImageBaseUrl,
} from "../../../utility/Utility";
import Select from "react-select";

function UpdateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProduct = location.state || {};

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [variations, setVariations] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [product, setProduct] = useState({
    product_id: "",
    product_name: "",
    category_id: "",
    subcategory_id: [],
    description: "",
    prev_cost_price: "",
  });

  // Initialize form with product data from location state
  useEffect(() => {
    if (initialProduct) {
      setProduct({
        product_id: initialProduct.product_id || "",
        product_name: initialProduct.product_name || "",
        category_id: initialProduct.category_id || "",
        subcategory_id:
          initialProduct.subcategories?.map((sc) => sc.subcategory_id) || [],
        description: initialProduct.description || "",
        prev_cost_price: initialProduct.prev_cost_price || "",
      });

      // Set existing images (these are the URLs from the server)
      setExistingImages(initialProduct.product_images || []);
      setVariations(initialProduct.pricing || []);
    }
  }, [initialProduct]);

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
      ...(name === "category_id" && { subcategory_id: [] }), // Reset subcategories when category changes
    }));
  };

  // Handle subcategory selection change
  const handleSubcategoryChange = (selectedOptions) => {
    setProduct((prev) => ({
      ...prev,
      subcategory_id: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const totalImages =
      existingImages.length -
      removedImages.length +
      imageFiles.length +
      files.length;
    if (totalImages > 5) {
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

  // Remove existing image
  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setRemovedImages((prev) => [...prev, imageToRemove]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!product.product_name) {
        throw new Error("Product name is required");
      }
      if (!product.category_id) {
        throw new Error("Please select a category");
      }
      if (product.subcategory_id.length === 0) {
        throw new Error("Please select at least one subcategory");
      }
      if (
        existingImages.length - removedImages.length + imageFiles.length ===
        0
      ) {
        throw new Error("Please keep at least one product image");
      }

      const formData = new FormData();

      // Append text fields
      formData.append("product_id", product.product_id);
      formData.append("product_name", product.product_name);
      formData.append("category_id", product.category_id);
      formData.append("prev_cost_price", product.prev_cost_price);
      formData.append("subcategory_id", JSON.stringify(product.subcategory_id));
      formData.append("description", product.description);

      // Append the images that should be kept (existing images minus removed ones)
      const keptImages = existingImages.filter(
        (img) => !removedImages.includes(img)
      );
      formData.append("product_images", JSON.stringify(keptImages));

      // Append removed images
      formData.append("removed_images", JSON.stringify(removedImages));

      // Append price variations if they exist
      if (variations.length > 0) {
        formData.append("pricing", JSON.stringify(variations));
      }

      // Append all new image files
      [...keptImages, imageFiles].forEach((file) => {
        formData.append("product_images", file);
      });

      const response = await putFormData(
        `api/product/update/${product.product_id}`,
        formData
      );

      if (response?.success) {
        toast.success("Product updated successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/product-list"),
        });
      } else {
        throw new Error(response?.message || "Failed to update product");
      }
    } catch (error) {
      toast.error(error.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // Get filtered subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat.category?.category_id === product.category_id
  );

  // Prepare options for react-select
  const subcategoryOptions = filteredSubcategories.map((subcat) => ({
    value: subcat.subcategory_id,
    label: subcat.subcategory_title,
  }));

  // Get selected subcategories for react-select
  const selectedSubcategories = subcategoryOptions.filter((option) =>
    product.subcategory_id.includes(option.value)
  );

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Update Product</h4>
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
                            value={selectedSubcategories}
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

                          {/* Existing Images */}
                          {existingImages.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3 my-2">
                              {existingImages.map((image, index) => (
                                <div
                                  key={`existing-${index}`}
                                  className="position-relative mx-2"
                                  style={{ width: "100px" }}
                                >
                                  <img
                                    src={`${ImageBaseUrl}${image}`}
                                    alt={`Product Image ${index + 1}`}
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
                                    onClick={() => removeExistingImage(index)}
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
                          )}

                          {/* New Images */}
                          {imagePreviews.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {imagePreviews.map((preview, index) => (
                                <div
                                  key={`new-${index}`}
                                  className="position-relative"
                                  style={{ width: "100px" }}
                                >
                                  <img
                                    src={preview}
                                    alt={`New Product Image ${index + 1}`}
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
                                    onClick={() => removeNewImage(index)}
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
                          )}

                          <div className="file-input-container">
                            <input
                              type="file"
                              id="productImageInput"
                              accept="image/*"
                              onChange={handleImageChange}
                              disabled={
                                loading ||
                                existingImages.length -
                                  removedImages.length +
                                  imageFiles.length >=
                                  5
                              }
                              className="form-control"
                              multiple
                            />
                            <small className="text-muted">
                              {existingImages.length -
                                removedImages.length +
                                imageFiles.length}
                              /5 images (JPEG, PNG, WEBP, Max 5MB each)
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
                    </div>

                    <div className="text-end mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                   
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Updating...
                          </>
                        ) : (
                          "Update Product"
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

export default UpdateProduct;
