import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ImageBaseUrl, postData } from "../../utility/Utility";
import { ToastContainer, toast } from "react-toastify";

function AddService() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [variantsList, setVariantsList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);

  useEffect(() => {
    const fetchVariantsAndTypes = async () => {
      const varRes = await postData("/variant/listing", { search: "", limit: 50, page: 1 });
      if (varRes.status) setVariantsList(varRes.data);

      const typeRes = await postData("/type/listing", { search: "", limit: 50, page: 1 });
      if (typeRes.status) setTypesList(typeRes.data);
    };
    fetchVariantsAndTypes();
  }, []);
  const handleAddVariant = () => {
    setSelectedVariants([...selectedVariants, { variantId: "", basePrice: "", types: [] }]);
  };
  const handleVariantChange = (index, field, value) => {
    const updated = [...selectedVariants];
    updated[index][field] = value;
    setSelectedVariants(updated);
    setService(prev => ({
      ...prev,
      variants: updated
    }));
  };

  const handleTypeChange = (variantIndex, typeId, field, value) => {
    const updated = [...selectedVariants];
    const typeIndex = updated[variantIndex].types.findIndex(t => t.typeId === typeId);

    if (typeIndex >= 0) {
      updated[variantIndex].types[typeIndex][field] = value;
    } else {
      updated[variantIndex].types.push({ typeId, additionalPrice: value });
    }
    setSelectedVariants(updated);
    setService(prev => ({
      ...prev,
      variants: updated
    }));
  };

  const [service, setService] = useState({
    categoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    icon: "",
    name: "",
    description: "",
    time: "",
    variants: [
      {
        variantId: "",
        basePrice: "",
        types: [
          {
            typeId: "",
            additionalPrice: ""
          }
        ]
      }
    ]
  });
  useEffect(() => {
    if (location.state) {
      if (service?.variants) {
        const mappedVariants = service.variants.map(v => ({
          variantId: v.variantId?._id || v.variantId || "",
          basePrice: v.basePrice || "",
          types: (v.types || []).map(t => ({
            typeId: t.typeId?._id || t.typeId || "",
            additionalPrice: t.additionalPrice || ""
          }))
        }));
        setSelectedVariants(mappedVariants);
      }
    }
  }, [service]);



  useEffect(() => {
    const loadInitialData = async () => {
      // Step 1: Load all categories first
      const catRes = await postData("/category/findAll");
      if (catRes.status) {
        setCategories(catRes.data);
      }

      // Step 2: If edit mode
      if (location.state && location.state.userData) {
        const userData = location.state.userData;
        // Step 3: Load subcategories based on saved categoryId
        let subCatRes = { status: false, data: [] };
        if (userData.categoryId) {
          subCatRes = await postData(`/subCategory/subCategoriesByCategory/${userData.categoryId}`);
          if (subCatRes.status) {
            setSubCategories(subCatRes.data);
          }
        }

        // Step 4: Load child categories based on saved subCategoryId
        let childCatRes = { status: false, data: [] };
        if (userData.subCategoryId) {
          childCatRes = await postData(`/childCategory/childCategoriesBySubCategory/${userData.subCategoryId._id}`);
          if (childCatRes.status) {
            setChildCategories(childCatRes.data);
          }
        }
        console.log(userData)
        setService({
          categoryId: userData?.subCategoryId?.categoryId?._id || "",
          subCategoryId: userData?.subCategoryId?._id || "",
          childCategoryId: userData?.childCategoryId?._id || "",
          icon: userData?.icon || "",
          name: userData?.name || "",
          description: userData?.description || "",
          time: userData?.time || "",
          variants: userData?.variants?.map(v => ({
            variantId: v?.variantId?._id || "",
            basePrice: v?.basePrice || "",
            types: v?.types?.map(t => ({
              typeId: t?.typeId?._id || "",
              additionalPrice: t?.additionalPrice || ""
            })) || []
          })) || []
        });
      }
    };

    loadInitialData();
  }, [location.state]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "categoryId") {
      setService((prev) => ({
        ...prev,
        categoryId: value,
        subCategoryId: "",
        childCategoryId: "",
      }));
      getSubCategories(value);
    }

    if (name === "subCategoryId") {
      setService((prev) => ({
        ...prev,
        subCategoryId: value,
        childCategoryId: "",
      }));
      getChildCategories(value);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${ImageBaseUrl}upload/submit`, formData);
        const uploadedUrl = response.data.data.imageUrl;
        const iconUrl = Array.isArray(uploadedUrl) ? uploadedUrl[0] : uploadedUrl;
        setService((prev) => ({ ...prev, icon: iconUrl }));
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
      } finally {
        setIsImageUploading(false);
      }
    }
  };
  // const handleRemoveVariant = (index) => {
  //   setSelectedVariants((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isImageUploading) {
      toast.warn("Please wait for image upload to complete.");
      return;
    }

    const payload = {
      categoryId: service.categoryId,
      subCategoryId: service.subCategoryId,
      childCategoryId: service.childCategoryId || null,
      icon: service.icon,
      name: service.name,
      description: service.description,
      time: Number(service.time),
      // variants: selectedVariants.map(v => ({
      //   variantId: v.variantId,
      //   basePrice: Number(v.basePrice),
      //   types: v.types.map(t => ({
      //     typeId: t.typeId,
      //     additionalPrice: Number(t.additionalPrice)
      //   }))
      // }))
      variants: service.variants
    };
    try {
      let response;
      if (location.state?.userData?._id) {
        response = await postData(`service/update/${location.state.userData._id}`, payload);
      } else {
        response = await postData("service/create", payload);
      }

      if (response.status) {
        toast.success(response.message);
        setTimeout(() => navigate("/service-management"), 1500);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit service");
    }
  };

  const getCategories = async () => {
    try {
      const res = await postData("/category/findAll");
      if (res.status) setCategories(res.data);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  const getSubCategories = async (categoryId) => {
    try {
      const res = await postData(`/subCategory/subCategoriesByCategory/${categoryId}`);
      if (res.status) setSubCategories(res.data);
    } catch (error) {
      console.error("Subcategory fetch error:", error);
    }
  };

  const getChildCategories = async (subCategoryId) => {
    console.log(subCategoryId, ":subCategoryIdsubCategoryIdsubCategoryId")
    try {
      const res = await postData(`/childCategory/childCategoriesBySubCategory/${subCategoryId}`);
      if (res.status) {
        setChildCategories(res.data);
      }
    } catch (error) {
      console.error("Child category fetch error:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="content-page">
      <ToastContainer />
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex justify-content-between align-items-center">
            <h4 className="fs-18 fw-semibold m-0">
              {location.state ? "Update Service" : "Add New Service"}
            </h4>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-1"></i> Back
            </button>
          </div>

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Category Dropdown */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Select Category*</label>
                    <select
                      className="form-select"
                      name="categoryId"
                      value={service.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SubCategory Dropdown */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Select Sub Category*</label>
                    <select
                      className="form-select"
                      name="subCategoryId"
                      value={service.subCategoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ChildCategory Dropdown */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Select Child Category*</label>
                    <select
                      className="form-select"
                      name="childCategoryId"
                      value={service.childCategoryId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Child Category</option>
                      {childCategories?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variants Section */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Add Variants*</label>
                    <button type="button" className="btn form-control btn-sm btn-outline-primary mt-1" onClick={handleAddVariant}>
                      + Add Variant
                    </button>
                  </div>
                  <div className="mb-4">

                    {selectedVariants?.map((variant, vIndex) => (
                      <div key={vIndex} className="border p-3 mt-2 rounded">
                        <div className="d-flex justify-content-between mb-2">
                          <div>
                            Varient
                          </div>
                          <div>
                            {/* <button
                              type="button"
                              className="btn btn-sm btn-outline-danger "
                              onClick={() => handleRemoveVariant(vIndex)}
                            >
                              ✕
                            </button> */}
                          </div>
                        </div>

                        {/* Variant Dropdown */}
                        <select
                          className="form-select mb-2"
                          value={variant.variantId}
                          onChange={(e) => handleVariantChange(vIndex, "variantId", e.target.value)}
                        >
                          <option value="">Select Variant</option>
                          {variantsList.map(v => (
                            <option key={v._id} value={v._id}>{v.unitType} - {v.units}</option>
                          ))}
                        </select>

                        {/* Base Price */}
                        <input
                          type="number"
                          placeholder="Base Price"
                          className="form-control mb-2"
                          value={variant.basePrice}
                          onChange={(e) => handleVariantChange(vIndex, "basePrice", e.target.value)}
                        />

                        {/* Types */}
                        <label className="form-label">Select Types & Additional Price</label>
                        {typesList?.map(type => {
                          const selectedType = variant.types.find(t => t.typeId === type._id);
                          return (
                            <div key={type._id} className="d-flex align-items-center mb-1">
                              <input
                                type="checkbox"
                                checked={!!selectedType}
                                onChange={(e) => {
                                  if (!e.target.checked) {
                                    handleVariantChange(
                                      vIndex,
                                      "types",
                                      variant.types.filter(t => t.typeId !== type._id)
                                    );
                                  } else {
                                    handleTypeChange(vIndex, type._id, "additionalPrice", 0);
                                  }
                                }}
                              />
                              <span className="ms-2">{type.name}</span>
                              {selectedType && (
                                <input
                                  type="number"
                                  placeholder="Additional Price"
                                  className="form-control ms-2"
                                  value={selectedType.additionalPrice || ""}
                                  onChange={(e) =>
                                    handleTypeChange(vIndex, type._id, "additionalPrice", e.target.value)
                                  }
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Service Name*</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={service.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time (in minutes)*</label>
                    <input
                      type="number"
                      name="time"
                      className="form-control"
                      value={service.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Description */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Description*</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={service.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  {/* Upload Icon */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Upload Icon*</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageUpload}
                    />
                    {service.icon && (
                      <div className="mt-2">
                        <img
                          src={service.icon}
                          alt="icon"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => navigate("/service-management")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary mypreventbtn"
                    disabled={isImageUploading}
                  >
                    {isImageUploading
                      ? "Uploading Image..."
                      : location.state
                        ? "Update Service"
                        : "Add Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddService;
