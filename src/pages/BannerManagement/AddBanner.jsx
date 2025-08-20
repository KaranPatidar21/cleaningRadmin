import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageBaseUrl, postData } from "../../utility/Utility";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function AddBanner() {
    const navigate = useNavigate();
    const location = useLocation();
    const editingBanner = location.state?.banner || null;

    const [addbanner, setAddBanner] = useState({
        title: "",
        description: "",
        type: "",
        image: "",
    });

    const [image, setImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(editingBanner ? true : false);

    useEffect(() => {
        if (editingBanner) {
            setAddBanner({
                title: editingBanner.title || "",
                description: editingBanner.description || "",
                type: editingBanner.type || "",
                image: editingBanner.image || "",
            });

            if (editingBanner.image) {
                setProfilePreview([editingBanner.image]);
            }
        }
    }, [editingBanner]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddBanner((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageUploaded(false); // reset imageUploaded flag on new image selection
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
                const imageUrl = res.data.data.imageUrl[0];
                setAddBanner((prev) => ({ ...prev, image: imageUrl }));
                setProfilePreview([imageUrl]);
                setImageUploaded(true); // ✅ Mark upload as successful
                toast.success("Image uploaded successfully!");
            } else {
                setImageUploaded(false);
                toast.error("Upload failed. No URL returned.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setImageUploaded(false);
            toast.error("Image upload failed!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (image) {
            handleUpload();
        }
    }, [image]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUploaded) {
            toast.warning("Please wait until the image upload is complete.");
            return;
        }

        try {
            setLoading(true);
            const endpoint = editingBanner
                ? `banner/update/${editingBanner._id}`
                : "banner/createbanner";

            const res = await postData(endpoint, addbanner);

            if (res?.status) {
                toast.success(editingBanner ? "Banner updated!" : "Banner added!");
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                toast.error("Something went wrong while saving the banner.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Failed to save banner.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-page">
            <div className="content">
                <ToastContainer />
                <div className="container-fluid">
                    <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
                        <div className="flex-grow-1">
                            <h4 className="fs-18 fw-semibold m-0">
                                {editingBanner ? "Update Banner" : "Add New Banner"}
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
                                            {["title", "description", "type"].map((field, index) => (
                                                <div className="col-md-6" key={index}>
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            {field.charAt(0).toUpperCase() + field.slice(1)}*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name={field}
                                                            placeholder={`Enter ${field}`}
                                                            value={addbanner[field]}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Banner Image*</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="form-control"
                                                    />
                                                    {profilePreview?.length > 0 ? (
                                                        <div className="mt-2 d-flex flex-wrap gap-2">
                                                            {profilePreview.map((preview, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={preview}
                                                                    alt={`Preview ${idx}`}
                                                                    style={{
                                                                        width: "100px",
                                                                        height: "100px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "8px",
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted mt-2">No banner found</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-md-12">
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
                                                        className="btn btn-primary mypreventbtn"
                                                        disabled={loading || !imageUploaded}
                                                    >
                                                        {loading
                                                            ? "Saving..."
                                                            : editingBanner
                                                                ? "Update Banner"
                                                                : "Add Banner"}
                                                    </button>
                                                </div>
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

export default AddBanner;
