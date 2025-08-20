import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddUsers() {
  const navigate = useNavigate();
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({
      ...vendor,
      [name]: value,
    });
  };

  // Handle profile image upload using react-dropzone
  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps } = useDropzone({
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
  const { getRootProps: getAadharRootProps, getInputProps: getAadharInputProps } = useDropzone({
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
  const { getRootProps: getPanRootProps, getInputProps: getPanInputProps } = useDropzone({
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
    const vendorData = {
      ...vendor,
      profile: profilePreview, // Store the profile image preview URL
      aadharImage: aadharPreview, // Store the Aadhar card image preview URL
      panImage: panPreview, // Store the PAN card image preview URL
    };

    // Get existing vendors from localStorage
    const existingVendors = JSON.parse(localStorage.getItem("vendors")) || [];

    // Add new vendor
    const updatedVendors = [...existingVendors, vendorData];

    // Save to localStorage
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));

    // Navigate to vendor list
    // navigate("/vendor-list");
  };


  const handleAddUser = () => {
toast.success("User deleted successfully");
  }
  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Add New User</h4>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-1"></i> Back
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
                          <label className="form-label">User Name*</label>
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
                          <label className="form-label">Address*</label>
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

                      {/* 
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
                          <label className="form-label">Aadhar Card Number*</label>
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
                      </div> */}




                      {/* 
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Additional Information</label>
                          <textarea
                            className="form-control"
                            name="additionalInfo"
                            rows="4"
                            placeholder="Enter additional information"
                            value={vendor.additionalInfo}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div> */}
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate("#")}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" onClick={handleAddUser}>
                        Add User
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

export default AddUsers;