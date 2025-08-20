import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postFormData } from "../../../utility/Utility";

export default function AddDeliveryFees() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    state_id: "",
    city_id: "",
    area_name: "",
    pincode: "",
    delivery_fee: "",
    min_order_for_free_delivery: "",
    estimated_time: "",
    latitude: "",
    longitude: "",
    zone: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleStatus = () => {
    setFormData({ ...formData, status: !formData.status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postFormData(
        "/api/delivery-fees/create",
        formData
      );

      if (response.success) {
        toast.success("Delivery fee added successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/delivery-fees-list"),
        });
      } else {
        toast.error(response.message || "Failed to add delivery fee");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Error adding delivery fee"
        );
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Add delivery fee error:", error);
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
                <h4 className="mb-1">Delivery Fees Management</h4>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">Delivery Fees</li>
                  <li className="breadcrumb-item active">Create Delivery Fee</li>
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
                  <h5 className="card-title mb-0">Create New Delivery Fee</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* State ID */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="state_id" className="form-label fw-medium">
                          State ID <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="state_id"
                          name="state_id"
                          className="form-control"
                          placeholder="Enter state ID"
                          value={formData.state_id}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* City ID */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="city_id" className="form-label fw-medium">
                          City ID <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="city_id"
                          name="city_id"
                          className="form-control"
                          placeholder="Enter city ID"
                          value={formData.city_id}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Area Name */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="area_name" className="form-label fw-medium">
                          Area Name <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="area_name"
                          name="area_name"
                          className="form-control"
                          placeholder="Enter area name"
                          value={formData.area_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Pincode */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="pincode" className="form-label fw-medium">
                          Pincode <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          className="form-control"
                          placeholder="Enter pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          pattern="[0-9]{6}"
                          title="6-digit pincode"
                        />
                      </div>
                    </div>

                    {/* Delivery Fee */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="delivery_fee" className="form-label fw-medium">
                          Delivery Fee <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          id="delivery_fee"
                          name="delivery_fee"
                          className="form-control"
                          placeholder="Enter delivery fee"
                          value={formData.delivery_fee}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Min Order for Free Delivery */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="min_order_for_free_delivery" className="form-label fw-medium">
                          Min Order for Free Delivery
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          id="min_order_for_free_delivery"
                          name="min_order_for_free_delivery"
                          className="form-control"
                          placeholder="Enter minimum order amount"
                          value={formData.min_order_for_free_delivery}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="estimated_time" className="form-label fw-medium">
                          Estimated Delivery Time (minutes)
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          id="estimated_time"
                          name="estimated_time"
                          className="form-control"
                          placeholder="Enter estimated delivery time"
                          value={formData.estimated_time}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Latitude */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="latitude" className="form-label fw-medium">
                          Latitude
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="latitude"
                          name="latitude"
                          className="form-control"
                          placeholder="Enter latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Longitude */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="longitude" className="form-label fw-medium">
                          Longitude
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="longitude"
                          name="longitude"
                          className="form-control"
                          placeholder="Enter longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Zone */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="zone" className="form-label fw-medium">
                          Zone
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="zone"
                          name="zone"
                          className="form-control"
                          placeholder="Enter zone"
                          value={formData.zone}
                          onChange={handleInputChange}
                        />
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
                            id="status"
                            checked={formData.status}
                            onChange={toggleStatus}
                            role="switch"
                            style={{ width: "2.5em", height: "1.25em" }}
                          />
                          <label className="form-check-label ms-2" htmlFor="status">
                            {formData.status ? (
                              <span className="text-success">Active</span>
                            ) : (
                              <span className="text-muted">Inactive</span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="row mt-4">
                      <div className="col-md-6 offset-md-3">
                        <button
                          type="submit"
                          className="btn btn-primary py-2"
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