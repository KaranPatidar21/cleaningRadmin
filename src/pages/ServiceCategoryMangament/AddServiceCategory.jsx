import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ImageBaseUrl, postData } from "../../utility/Utility";

function AddUServiceCategory() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = location.state || {};
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(!!(userData && userData.images?.length));
    const [servicectg, setServiceCtg] = useState({
        images: [],
        name: "",
        description: "",
    });

    useEffect(() => {
        if (userData) {
            setServiceCtg({
                images: Array.isArray(userData.images) ? userData.images : [userData.images],
                name: userData.name || "",
                description: userData.description || "",
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceCtg((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleImageSelectAndSubmit = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImageUploading(true);
        setIsImageUploaded(false);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axios.post(`${ImageBaseUrl}upload/submit`, formData);

            const imageUrl = response?.data?.data?.imageUrl?.[0];
            if (imageUrl) {
                // setServiceCtg((prev) => ({
                //     ...prev,
                //     images: [...prev.images, imageUrl],
                // }));
                setServiceCtg((prev) => ({
                    ...prev,
                    images: [imageUrl],
                }));

                setIsImageUploaded(true);
            } else {
                toast.error("Image upload failed");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Error uploading image");
        } finally {
            setIsImageUploading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: servicectg.name,
            images: servicectg.images,
            description: servicectg.description,
        };

        try {
            const response = await postData("/category/create", payload);
            if (response.status) {
                toast.dismiss();
                toast.success(response.message);
                setTimeout(() => navigate("/service-category"), 3000);
            } else {
                toast.error(response.message || "Error creating category");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Submission failed");
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: servicectg.name,
            images: servicectg.images,
            description: servicectg.description,
        };

        try {
            const response = await postData(`/category/update/${userData?._id}`, payload);
            if (response.status) {
                toast.dismiss();
                toast.success(response.message);
                setTimeout(() => navigate("/service-category"), 3000);
            } else {
                toast.error(response.message || "Error updating category");
            }
        } catch (error) {
            console.error("Error updating data:", error);
            toast.error("Update failed");
        }
    };

    return (
        <div className="content-page">
            <ToastContainer />
            <div className="content">
                <div className="container-fluid">
                    <div className="py-3 d-flex justify-content-between align-items-center">
                        <h4 className="fs-18 fw-semibold m-0">
                            {userData ? "Update Category" : "Add New Category"}
                        </h4>
                        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left me-1"></i> Back
                        </button>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <form onSubmit={userData ? handleUpdateSubmit : handleSubmit}>
                                <div className="row">


                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Category Name*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={servicectg.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Upload Image*</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleImageSelectAndSubmit}
                                            required={!userData}
                                        />
                                        <div className="mt-2 d-flex flex-wrap gap-2">
                                            {servicectg.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`preview-${idx}`}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: "cover", borderRadius: "8px" }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Description*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            value={servicectg.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mypreventbtn"
                                            disabled={isImageUploading || !isImageUploaded}
                                        >
                                            {isImageUploading ? "Uploading Image..." : userData ? "Update" : "Submit"}
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

export default AddUServiceCategory;
