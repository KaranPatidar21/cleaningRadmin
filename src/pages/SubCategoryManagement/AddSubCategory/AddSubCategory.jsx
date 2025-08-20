import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../../utility/Utility";
import { ImageBaseUrl } from "../../../utility/Utility"
function AddSubCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.subCategoryData;
  const [categories, setCategories] = useState([])
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [subCategory, setSubCategory] = useState({
    name: "",
    images: [],
    description: "",
    categoryId: "",
  });
  useEffect(() => {
    if (editData) {
      setSubCategory({
        name: editData.name || "",
        images: editData.images || [],
        description: editData.description || "",
        categoryId: editData.categoryId || "",
      });
    }
  }, [editData]);
  const getCategories = async () => {
    try {
      const res = await postData("category/findAll")
      if (res.status) {
        setCategories(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCategories()
  }, [])
  console.log(categories, ":categories")
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelectAndSubmit = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImageUploading(true); // 👈 Start uploading

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${ImageBaseUrl}upload/submit`, formData);

      const imageUrl = response?.data?.data?.imageUrl?.[0];
      if (imageUrl) {
        setSubCategory((prev) => ({
          ...prev,
          images: [imageUrl],
        }));
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

    if (isImageUploading) {
      toast.warn("Please wait for the image to finish uploading.");
      return;
    }

    const payload = {
      name: subCategory.name,
      images: subCategory.images,
      description: subCategory.description,
      categoryId: subCategory.categoryId,
    };

    try {
      let response;
      if (editData) {
        response = await postData(`/subCategory/update/${editData._id}`, payload);
      } else {
        response = await postData("/subCategory/create", payload);
      }

      if (response.status) {
        toast.dismiss();
        toast.success(response.message || "Success");
        setTimeout(() => navigate("/subcategory-list"), 3000);
      } else {
        toast.error(response.message || "Error processing request");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission failed");
    }
  };



  return (
    <div className="content-page">
      <ToastContainer />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex justify-content-between align-items-center">
            <h4 className="fs-18 fw-semibold m-0">
              {editData ? "Edit Sub Category" : "Add New Sub Category"}
            </h4>
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-1"></i> Back
            </button>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label"> Select Category*</label>

                    <select
                      className="form-select"
                      name="categoryId"
                      value={subCategory.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Subcategory Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={subCategory.name}
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
                      required={subCategory.images.length === 0}
                    />
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {subCategory.images.map((img, idx) => (
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






                  <div className="col-md-6 mb-3">
                    <label className="form-label">Description*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={subCategory.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12 mt-3">

                    <button
                      type="submit"
                      className="btn btn-primary mypreventbtn"
                      disabled={isImageUploading || subCategory.images.length === 0}
                    >
                      {isImageUploading
                        ? "Uploading Image..."
                        : editData
                          ? "Update"
                          : "Submit"}
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

export default AddSubCategory;
