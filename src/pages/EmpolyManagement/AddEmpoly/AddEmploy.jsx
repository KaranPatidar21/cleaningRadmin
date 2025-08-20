import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function AddEmploy() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("warehouse"); // Default to warehouse
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    image: null,
    aadharPhoto: null,
    additionalInfo: "",
    // Warehouse-specific fields
    capacity: "",
    managerName: "",
    // Purchaser-specific fields
    shopNumber: "",
    shopName: "",
    shopAddress: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [aadharPhotoPreview, setAadharPhotoPreview] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload using react-dropzone
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    },
  });

  // Handle Aadhar photo upload using react-dropzone
  const { getRootProps: getAadharPhotoRootProps, getInputProps: getAadharPhotoInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFormData({
        ...formData,
        aadharPhoto: file,
      });
      setAadharPhotoPreview(URL.createObjectURL(file));
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields based on user type
    if (userType === "warehouse") {
      if (
        !formData.name ||
        !formData.location ||
        !formData.contactNumber ||
        !formData.email ||
        !formData.capacity ||
        !formData.managerName
      ) {
        alert("Please fill all required fields for Warehouse.");
        return;
      }
    } else {
      if (
        !formData.name ||
        !formData.location ||
        !formData.contactNumber ||
        !formData.email ||
        !formData.shopNumber ||
        !formData.shopName ||
        !formData.shopAddress
      ) {
        alert("Please fill all required fields for Purchaser.");
        return;
      }
    }

    // Create data object based on user type
    const data = {
      ...formData,
      image: imagePreview, // Store image preview URL
      aadharPhoto: aadharPhotoPreview, // Store Aadhar photo preview URL
    };

    // Save to localStorage
    const key = userType === "warehouse" ? "warehouses" : "purchasers";
    const existingData = JSON.parse(localStorage.getItem(key)) || [];
    const updatedData = [...existingData, data];
    localStorage.setItem(key, JSON.stringify(updatedData));

    // Navigate to the appropriate list page
    navigate(userType === "warehouse" ? "/warehouse-list" : "/purchaser-list");
  };

  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Add New {userType === "warehouse" ? "Warehouse" : "Purchaser"}</h4>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
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
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Select Type*</label>
                          <select
                            className="form-control"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                          >
                            <option value="warehouse">Warehouse</option>
                            <option value="purchaser">Purchaser</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Common Fields */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Location*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Contact Number*</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="contactNumber"
                            placeholder="Enter contact number"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email*</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Image*</label>
                          <div
                            {...getImageRootProps({
                              className: "dropzone",
                              style: {
                                border: "2px dashed #007bff",
                                borderRadius: "8px",
                                padding: "20px",
                                textAlign: "center",
                                cursor: "pointer",
                              },
                            })}
                          >
                            <input {...getImageInputProps()} />
                            <p>Drag & drop an image here, or click to select a file</p>
                          </div>
                          <small className="text-muted">You can upload an image</small>
                        </div>
                      </div>

                      {imagePreview && (
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Image Preview</label>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Aadhar Photo*</label>
                          <div
                            {...getAadharPhotoRootProps({
                              className: "dropzone",
                              style: {
                                border: "2px dashed #007bff",
                                borderRadius: "8px",
                                padding: "20px",
                                textAlign: "center",
                                cursor: "pointer",
                              },
                            })}
                          >
                            <input {...getAadharPhotoInputProps()} />
                            <p>Drag & drop an Aadhar photo here, or click to select a file</p>
                          </div>
                          <small className="text-muted">You can upload an Aadhar photo</small>
                        </div>
                      </div>

                      {aadharPhotoPreview && (
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Aadhar Photo Preview</label>
                            <img
                              src={aadharPhotoPreview}
                              alt="Aadhar Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Warehouse-Specific Fields */}
                    {userType === "warehouse" && (
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Capacity*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="capacity"
                              placeholder="Enter capacity (e.g., 1000 sq ft)"
                              value={formData.capacity}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Manager Name*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="managerName"
                              placeholder="Enter manager name"
                              value={formData.managerName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purchaser-Specific Fields */}
                    {userType === "purchaser" && (
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Shop Number*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shopNumber"
                              placeholder="Enter shop number"
                              value={formData.shopNumber}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Shop Name*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shopName"
                              placeholder="Enter shop name"
                              value={formData.shopName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Shop Address*</label>
                            <textarea
                              className="form-control"
                              name="shopAddress"
                              rows="4"
                              placeholder="Enter shop address"
                              value={formData.shopAddress}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Information */}
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Additional Information</label>
                          <textarea
                            className="form-control"
                            name="additionalInfo"
                            rows="4"
                            placeholder="Enter additional information"
                            value={formData.additionalInfo}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {userType === "warehouse" ? "Add Warehouse" : "Add Purchaser"}
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

export default AddEmploy;


