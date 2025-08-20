import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { postData, ImageBaseUrl } from "../../utility/Utility";

function AddOffer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [profilePreview, setProfilePreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [offerData, setOfferData] = useState({
    categoryId: "",
    serviceId: "",
    title: "",
    startDate: "",
    endDate: "",
    image: "",
  });

  // ✅ Load all categories
  useEffect(() => {
    const loadCategories = async () => {
      const res = await postData("/category/findAll");
      if (res?.status) setCategories(res.data);
    };
    loadCategories();
  }, []);

  // ✅ Load services on category select
  useEffect(() => {
    const loadServices = async () => {
      if (!offerData.categoryId) return;
      const res = await postData(`service/serviceByCategory/${offerData.categoryId}`);
      if (res?.status) setServices(res.data);
    };
    loadServices();
  }, [offerData.categoryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUploaded(false);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);
    try {
      setLoading(true);
      const res = await axios.post(`${ImageBaseUrl}upload/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.status) {
        const uploadedUrl = Array.isArray(res.data.data.imageUrl)
          ? res.data.data.imageUrl[0]
          : res.data.data.imageUrl;
        setOfferData((prev) => ({ ...prev, image: uploadedUrl }));
        setProfilePreview([uploadedUrl]);
        setImageUploaded(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (image) handleUpload();
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUploaded) {
      toast.warning("Please wait for image to upload");
      return;
    }

    try {
      setLoading(true);
      const res = await postData("https://api.gsfmasterclean.com/v1/offer/createOffer", offerData);
      if (res.status) {
        toast.success("Offer created successfully");
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error(res.message || "Failed to create offer");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-page">
      <ToastContainer />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex justify-content-between align-items-center">
            <h4 className="fs-18 fw-semibold m-0">Add Offer</h4>
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-1"></i> Back
            </button>
          </div>

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* ✅ Category */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category*</label>
                    <select
                      name="categoryId"
                      className="form-select"
                      value={offerData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ✅ Service */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Service*</label>
                    <select
                      name="serviceId"
                      className="form-select"
                      value={offerData.serviceId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Service</option>
                      {services.map((srv) => (
                        <option key={srv._id} value={srv._id}>
                          {srv.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title*</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={offerData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Start Date */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Start Date*</label>
                    <input
                      type="date"
                      name="startDate"
                      className="form-control"
                      value={offerData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">End Date*</label>
                    <input
                      type="date"
                      name="endDate"
                      className="form-control"
                      value={offerData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Upload Image*</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                    {profilePreview?.length > 0 && (
                      <div className="mt-2">
                        <img
                          src={profilePreview[0]}
                          alt="Preview"
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

                  {/* Buttons */}
                  <div className="text-end">
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
                      disabled={loading || !imageUploaded}
                    >
                      {loading ? "Saving..." : "Add Offer"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOffer;
