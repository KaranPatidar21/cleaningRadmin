import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData, putData } from "../../../utility/Utility";

export default function UpdateRole() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    role_name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await putData(`/api/role/update/${location?.state?.role_id}`, formData);

      if (response?.success) {
        toast.success("Role Update successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/role-list"),
        });
      } else {
        toast.error(response.data.message || "Failed to add role");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Error adding role");
      } else if (error.request) {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Add role error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("location", location?.state);
    setFormData(location?.state);
  }, [location]);
  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Add Role</h4>
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
                <div className="card-header">
                  <h5 className="card-title mb-0">Role Details</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label htmlFor="role_name" className="form-label">
                            Role Name*
                          </label>
                          <input
                            type="text"
                            id="role_name"
                            name="role_name"
                            className="form-control"
                            placeholder="Enter role name"
                            value={formData.role_name}
                            onChange={handleInputChange}
                            required
                            minLength={3}
                            maxLength={50}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Adding...
                          </>
                        ) : (
                          "Add Role"
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
