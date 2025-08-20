import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function UpdateVendorManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const vendorData = location.state?.vendor; // Get the vendor data from location state

  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
    aadhar: "",
    pan: "",
    profile: null,
    aadharImage: null,
    panImage: null,
    additionalInfo: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);

  // Populate the form with the vendor data when the component mounts
  useEffect(() => {
    if (vendorData) {
      setVendor(vendorData);
      setProfilePreview(vendorData.profile);
      setAadharPreview(vendorData.aadharImage);
      setPanPreview(vendorData.panImage);
    }
  }, [vendorData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({
      ...vendor,
      [name]: value,
    });
  };

  // Handle profile image upload using react-dropzone
  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
  } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setVendor({
        ...vendor,
        profile: acceptedFiles[0],
      });
      // Create preview URL
      setProfilePreview(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  // Handle Aadhar card image upload
  const {
    getRootProps: getAadharRootProps,
    getInputProps: getAadharInputProps,
  } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setVendor({
        ...vendor,
        aadharImage: acceptedFiles[0],
      });
      // Create preview URL
      setAadharPreview(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  // Handle PAN card image upload
  const { getRootProps: getPanRootProps, getInputProps: getPanInputProps } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        setVendor({
          ...vendor,
          panImage: acceptedFiles[0],
        });
        // Create preview URL
        setPanPreview(URL.createObjectURL(acceptedFiles[0]));
      },
    });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create vendor object with image URLs
    const updatedVendor = {
      ...vendor,
      profile: profilePreview, // Store the profile image preview URL
      aadharImage: aadharPreview, // Store the Aadhar card image preview URL
      panImage: panPreview, // Store the PAN card image preview URL
    };

    // Get existing vendors from localStorage
    const existingVendors = JSON.parse(localStorage.getItem("vendors")) || [];

    // Find the index of the vendor to update
    const vendorIndex = existingVendors.findIndex(
      (v) => v.email === vendorData.email
    );

    // Update the vendor data
    if (vendorIndex !== -1) {
      existingVendors[vendorIndex] = updatedVendor;
    }

    // Save to localStorage
    localStorage.setItem("vendors", JSON.stringify(existingVendors));

    // Navigate to vendor list
    navigate("/vendor-list");
  };

  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Update Vendor</h4>
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
                          <label className="form-label">Vendor Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter vendor name"
                            value={vendor.name}
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
                            value={vendor.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mobile Number*</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="mobile"
                            placeholder="Enter mobile number"
                            value={vendor.mobile}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="state"
                            placeholder="Enter state"
                            value={vendor.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">District*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="district"
                            placeholder="Enter district"
                            value={vendor.district}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Aadhar Card Number*
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="aadhar"
                            placeholder="Enter Aadhar card number"
                            value={vendor.aadhar}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">PAN Card Number*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="pan"
                            placeholder="Enter PAN card number"
                            value={vendor.pan}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Profile Image*</label>
                          <div
                            {...getProfileRootProps({
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
                            <input {...getProfileInputProps()} />
                            <p>
                              Drag & drop a profile image here, or click to
                              select a file
                            </p>
                          </div>
                          <small className="text-muted">
                            You can upload a profile image
                          </small>
                        </div>
                      </div>

                      {profilePreview && (
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Profile Preview
                            </label>
                            <img
                              src={profilePreview}
                              alt="Profile Preview"
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

                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Aadhar Card Image*
                          </label>
                          <div
                            {...getAadharRootProps({
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
                            <input {...getAadharInputProps()} />
                            <p>
                              Drag & drop an Aadhar card image here, or click to
                              select a file
                            </p>
                          </div>
                          <small className="text-muted">
                            You can upload an Aadhar card image
                          </small>
                        </div>
                      </div>

                      {aadharPreview && (
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Aadhar Card Preview
                            </label>
                            <img
                              src={aadharPreview}
                              alt="Aadhar Card Preview"
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

                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">PAN Card Image*</label>
                          <div
                            {...getPanRootProps({
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
                            <input {...getPanInputProps()} />
                            <p>
                              Drag & drop a PAN card image here, or click to
                              select a file
                            </p>
                          </div>
                          <small className="text-muted">
                            You can upload a PAN card image
                          </small>
                        </div>
                      </div>

                      {panPreview && (
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">
                              PAN Card Preview
                            </label>
                            <img
                              src={panPreview}
                              alt="PAN Card Preview"
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

                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Additional Information
                          </label>
                          <textarea
                            className="form-control"
                            name="additionalInfo"
                            rows="4"
                            placeholder="Enter additional information"
                            value={vendor.additionalInfo}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Vendor
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

export default UpdateVendorManagement;
