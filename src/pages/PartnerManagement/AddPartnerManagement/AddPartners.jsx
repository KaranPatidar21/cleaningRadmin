import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { ImageBaseUrl, postData } from "../../../utility/Utility";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
function AddPartners() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDataEdit, type } = location.state || {}; 
  const [partner, setPartner] = useState({
    name: "",
    phoneNo: "",
    email: "",
    address: "",
    location: {
      "lat": 22.7196,
      "lng": 75.8577
    },
    image: "",
    idProof: "",
    vehicleImage: "",
    drivingLicence: "",
    identityCard: "",
    panImage: "",
    createdBy: "admin",
    services: [],
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [vehiclePreview, setVehiclePreview] = useState(null);
  const [drivingLicencePreview, setDrivingLicencePreview] = useState(null);
  const [identityCardPreview, setIdentityCardPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [serviceCategory, setserviceCategory] = useState([])
  useEffect(() => {
    if (userDataEdit) {
      setPartner((prevPartner) => ({
        ...prevPartner,
        ...userDataEdit,
        location: userDataEdit.location || prevPartner.location 
      }));
    }
    setProfilePreview(userDataEdit?.image || null);
    setAadharPreview(userDataEdit?.idProof || null);
    setVehiclePreview(userDataEdit?.vehicleImage || null);
    setDrivingLicencePreview(userDataEdit?.drivingLicence || null);
    setIdentityCardPreview(userDataEdit?.identityCard || null);
  }, [userDataEdit]);
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartner({
      ...partner,
      [name]: value,
    });
  };
  const getServices = async () => {
    try {
      const response = await postData("/service/listing");
      setserviceCategory(response.data.services);
      if (response.status) {
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  useEffect(() => {
    getServices()
  }, [])
  const handleImageUpload = async (file, fieldName, setPreview) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${ImageBaseUrl}upload/submit`, formData);
        const imageUrl = response.data.data?.imageUrl?.[0];
        if (imageUrl) {
          setPartner((prevPartner) => ({
            ...prevPartner,
            [fieldName]: imageUrl,
          }));
          setPreview(imageUrl);
        }
        console.log(`Upload success for ${fieldName}:`, response.data);
      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
      }
    }
  };
  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0], "image", setProfilePreview);
      }
    },
  });
  // Aadhar Upload
  const { getRootProps: getAadharRootProps, getInputProps: getAadharInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0], "idProof", setAadharPreview);
      }
    },
  });
  // Vehicle Image Upload
  const { getRootProps: getVehicleRootProps, getInputProps: getVehicleInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0], "vehicleImage", setVehiclePreview);
      }
    },
  });
  // Driving Licence Upload
  const { getRootProps: getDrivingLicenceRootProps, getInputProps: getDrivingLicenceInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0], "drivingLicence", setDrivingLicencePreview);
      }
    },
  });
  // Identity Card Upload
  const { getRootProps: getIdentityCardRootProps, getInputProps: getIdentityCardInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0], "identityCard", setIdentityCardPreview);
      }
    },
  });
  // PAN Card Upload
  const { getRootProps: getPanRootProps, getInputProps: getPanInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0], "panImage", setPanPreview);
      }
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "edit") {
        // Call update API
        const response = await postData("/partner/updatePartner", partner);
        if (response.status) {
          toast.success("Partner updated successfully");
        } else {
          toast.error(response.message || "Update failed");
        }
      } else {
        // Add new partner
        const response = await postData("/partner/createPartner", partner);
        if (response.status) {
          toast.success("Partner added successfully");
        } else {
          toast.error(response.message || "Addition failed");
        }
      }
      setTimeout(() => navigate("/partner-management"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleUpdatepartner = async () => {

  }
  const handleselectServiceChange = (e) => {
    const selectedId = e.target.value;
    const isChecked = e.target.checked;

    setPartner((prev) => {
      let updatedServiceIds = [...prev.services];

      if (isChecked) {
        // Add ID if not already present
        if (!updatedServiceIds.includes(selectedId)) {
          updatedServiceIds.push(selectedId);
        }
      } else {
        // Remove ID if unchecked
        updatedServiceIds = updatedServiceIds.filter((id) => id !== selectedId);
      }

      return {
        ...prev,
        services: updatedServiceIds,
      };
    });
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">
                {type === "edit" ? "Edit Partner" : "Add New Partner"}
              </h4>



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
                          <label className="form-label">Partner Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter partner name"
                            value={partner.name}
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
                            value={partner.email}
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
                            name="phoneNo"
                            placeholder="Enter mobile number"
                            value={partner.phoneNo}
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
                            name="address"
                            placeholder="Enter address"
                            value={partner.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Location*</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                       
                          <div className="form-group">
                            <div className="dropdown">
                              <button
                                className="btn btn-light dropdown-toggle form-control text-left"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {partner.services.length > 0
                                  ? `Selected Services (${partner.services.length})`
                                  : "Select Services"}
                              </button>
                              <ul className="dropdown-menu" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {serviceCategory?.map((service) => (
                                  <li key={service._id} className="dropdown-item">
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        id={service._id}
                                        value={service._id}
                                        checked={partner.services.includes(service._id)}
                                        onChange={handleselectServiceChange}
                                        className="form-check-input"
                                      />
                                      <label htmlFor={service._id} className="form-check-label">
                                        {service.name}
                                      </label>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>


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
                            <p>Drag & drop a profile image here, or click to select</p>
                          </div>
                          {profilePreview && (
                            <div className="mt-2">
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
                          )}
                        </div>
                      </div>
                      {/* {/ Aadhar Card Image /} */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Aadhar Card Image*</label>
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
                            <p>Drag & drop an Aadhar card image here, or click to select</p>
                          </div>
                          {aadharPreview && (
                            <div className="mt-2">
                              <img
                                src={aadharPreview}
                                alt="Aadhar Card Preview"
                                // value={partner.image}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* {/ Vehicle Image /} */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Vehicle Image*</label>
                          <div
                            {...getVehicleRootProps({
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
                            <input {...getVehicleInputProps()} />
                            <p>Drag & drop a vehicle image here, or click to select</p>
                          </div>
                          {vehiclePreview && (
                            <div className="mt-2">
                              <img
                                src={vehiclePreview}
                                alt="Vehicle Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* {/ Driving Licence /} */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Driving Licence*</label>
                          <div
                            {...getDrivingLicenceRootProps({
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
                            <input {...getDrivingLicenceInputProps()} />
                            <p>Drag & drop a driving licence here, or click to select</p>
                          </div>
                          {drivingLicencePreview && (
                            <div className="mt-2">
                              <img
                                src={drivingLicencePreview}
                                alt="Driving Licence Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* {/ Identity Card /} */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Identity Card*</label>
                          <div
                            {...getIdentityCardRootProps({
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
                            <input {...getIdentityCardInputProps()} />
                            <p>Drag & drop an identity card here, or click to select</p>
                          </div>
                          {identityCardPreview && (
                            <div className="mt-2">
                              <img
                                src={identityCardPreview}
                                alt="Identity Card Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {type === "edit" ? <div className="col-md-12">
                        <div className="text-end">
                          <button type="submit" className="btn btn-primary" onClick={handleUpdatepartner}>
                            Update
                          </button>
                        </div>
                      </div> : <div className="col-md-12">
                        <div className="text-end">
                          <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => navigate(-1)}
                          >
                            Cancel
                          </button>
                          
                          <button type="submit" className="btn btn-primary">
                            {type === "edit" ? "Update Partner" : "Add Partner"}
                          </button>
                        </div>
                      </div>}
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
export default AddPartners;