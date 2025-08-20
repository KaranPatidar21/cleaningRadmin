    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { useDropzone } from "react-dropzone";

    function AddWarehouseManagement() {
    const navigate = useNavigate();
    const [warehouse, setWarehouse] = useState({
        warehouseName: "",
        location: "",
        capacity: "",
        managerName: "",
        contactNumber: "",
        warehouseImage: null,
        additionalInfo: "",
    });
    const [warehouseImagePreview, setWarehouseImagePreview] = useState(null);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWarehouse({
        ...warehouse,
        [name]: value,
        });
    };

    // Handle warehouse image upload using react-dropzone
    const { getRootProps: getWarehouseImageRootProps, getInputProps: getWarehouseImageInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
        setWarehouse({
            ...warehouse,
            warehouseImage: acceptedFiles[0],
        });
        // Create preview URL
        setWarehouseImagePreview(URL.createObjectURL(acceptedFiles[0]));
        },
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create warehouse object with image URL
        const warehouseData = {
        ...warehouse,
        warehouseImage: warehouseImagePreview, // Store the warehouse image preview URL
        };

        // Get existing warehouses from localStorage
        const existingWarehouses = JSON.parse(localStorage.getItem("warehouses")) || [];

        // Add new warehouse
        const updatedWarehouses = [...existingWarehouses, warehouseData];

        // Save to localStorage
        localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));

        // Navigate to warehouse list
        navigate("/warehouse-list");
    };

    return (
        <div className="content-page">
        <div className="content">
            <div className="container-fluid">
            <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                <div className="flex-grow-1">
                <h4 className="fs-18 fw-semibold m-0">Add New Warehouse</h4>
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
                            <label className="form-label">Warehouse Name*</label>
                            <input
                                type="text"
                                className="form-control"
                                name="warehouseName"
                                placeholder="Enter warehouse name"
                                value={warehouse.warehouseName}
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
                                value={warehouse.location}
                                onChange={handleInputChange}
                                required
                            />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                            <label className="form-label">Capacity*</label>
                            <input
                                type="text"
                                className="form-control"
                                name="capacity"
                                placeholder="Enter capacity (e.g., 1000 sq ft)"
                                value={warehouse.capacity}
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
                                value={warehouse.managerName}
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
                                value={warehouse.contactNumber}
                                onChange={handleInputChange}
                                required
                            />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="mb-3">
                            <label className="form-label">Warehouse Image*</label>
                            <div
                                {...getWarehouseImageRootProps({
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
                                <input {...getWarehouseImageInputProps()} />
                                <p>
                                Drag & drop a warehouse image here, or click to
                                select a file
                                </p>
                            </div>
                            <small className="text-muted">
                                You can upload a warehouse image
                            </small>
                            </div>
                        </div>

                        {warehouseImagePreview && (
                            <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label">Warehouse Image Preview</label>
                                <img
                                src={warehouseImagePreview}
                                alt="Warehouse Preview"
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
                            <label className="form-label">Additional Information</label>
                            <textarea
                                className="form-control"
                                name="additionalInfo"
                                rows="4"
                                placeholder="Enter additional information"
                                value={warehouse.additionalInfo}
                                onChange={handleInputChange}
                            ></textarea>
                            </div>
                        </div>
                        </div>

                        <div className="text-end">
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => navigate("/warehouse-list")}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Warehouse
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

    export default AddWarehouseManagement;