import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData,getData } from "../../../utility/Utility";

export default function AddRoleRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
    status: "active",
    note: "",
    user_information: {},
    module_type_permissions: {
      dashboard: { view: true, edit: false },
      users: { view: false, edit: false },
      reports: { view: false, edit: false },
    },
    permission_to_edit: {
      can_edit_profile: true,
      can_edit_settings: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
      const response = await getData("api/role/get-all");
      if (response?.success) {
        setRoles(response?.results);
        }
      } catch (error) {
        toast.error("Failed to fetch roles");
      }
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module, permission, value) => {
    setFormData((prev) => ({
      ...prev,
      module_type_permissions: {
        ...prev.module_type_permissions,
        [module]: {
          ...prev.module_type_permissions[module],
          [permission]: value,
        },
      },
    }));
  };

  const handleEditPermissionChange = (permission, value) => {
    setFormData((prev) => ({
      ...prev,
      permission_to_edit: {
        ...prev.permission_to_edit,
        [permission]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData("api/auth/register", formData);

      if (response?.success) {
        toast.success("Employee registered successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/home"),
        });
      } else {
        toast.error(response?.message || "Failed to register employee");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            error.response.data?.error ||
            "Error registering employee"
        );
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Register employee error:", error);
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
                <h4 className="mb-1">Employee Management</h4>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">Employee</li>
                  <li className="breadcrumb-item active">Register Employee</li>
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
                  <h5 className="card-title mb-0">Register New Employee</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          className="form-control"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          className="form-control"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          name="role_id"
                          className="form-select"
                          value={formData.role_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          name="status"
                          className="form-select"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    {/* Module Permissions */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <h5 className="mb-3">Module Permissions</h5>
                        <div className="row">
                          {Object.entries(formData.module_type_permissions).map(
                            ([module, permissions]) => (
                              <div key={module} className="col-md-4 mb-3">
                                <div className="card">
                                  <div className="card-header">
                                    <h6 className="mb-0 text-capitalize">
                                      {module}
                                    </h6>
                                  </div>
                                  <div className="card-body">
                                    {Object.entries(permissions).map(
                                      ([permission, value]) => (
                                        <div
                                          key={`${module}-${permission}`}
                                          className="form-check form-switch mb-2"
                                        >
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`${module}-${permission}`}
                                            checked={value}
                                            onChange={(e) =>
                                              handlePermissionChange(
                                                module,
                                                permission,
                                                e.target.checked
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label text-capitalize"
                                            htmlFor={`${module}-${permission}`}
                                          >
                                            {permission}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Permissions */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <h5 className="mb-3">Edit Permissions</h5>
                        <div className="row">
                          {Object.entries(formData.permission_to_edit).map(
                            ([permission, value]) => (
                              <div key={permission} className="col-md-4 mb-3">
                                <div className="form-check form-switch">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={permission}
                                    checked={value}
                                    onChange={(e) =>
                                      handleEditPermissionChange(
                                        permission,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <label
                                    className="form-check-label text-capitalize"
                                    htmlFor={permission}
                                  >
                                    {permission.replace(/_/g, " ")}
                                  </label>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label fw-medium">Notes</label>
                        <textarea
                          name="note"
                          className="form-control"
                          rows={3}
                          value={formData.note}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="row mt-4">
                      <div className="col-12 text-end">
                        <button
                          type="submit"
                          className="btn btn-primary px-4 py-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Registering...
                            </>
                          ) : (
                            "Register Employee"
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



