import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaSave,
  FaPlus,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../utility/Utility";

const PriceManagementCalculator = ({ productId }) => {
  const pieceOptions = [
    { value: "piece", label: "Piece" },
    { value: "bunch", label: "Bunch" },
    { value: "dozen", label: "Dozen" },
    { value: "packet", label: "Packet" },
    { value: "kg", label: "Kilogram" },
  ];

  const [productBasePrice, setProductBasePrice] = useState("");
  const [variations, setVariations] = useState([]);
  const [currentVariation, setCurrentVariation] = useState({
    id: null,
    min_weight: "",
    max_weight: "",
    calculatedWeight: "",
    enable_piece_type: false,
    pieceType: "piece",
    pieceCount: "",
    profit_percentage: "",
    discount_percentage: 0,
    isActive: true,
    selling_price: "",
    final_price: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  // Calculate weight based on max weight
  const calculateWeight = (max) => {
    return parseFloat(max) || 0;
  };

  // Calculate selling prices
  const calculateSellingPrices = (
    weight,
    profit_percentage,
    discount_percentage,
    basePrice
  ) => {
    const price = parseFloat(basePrice || productBasePrice) || 0;
    const weightVal = parseFloat(weight) || 0;
    const profitPercent = parseFloat(profit_percentage) || 0;
    const discountPercent = parseFloat(discount_percentage) || 0;

    if (price && weightVal && profitPercent) {
      const pricePerGm = price / 1000;
      const priceWithProfit =
        pricePerGm * weightVal * (1 + profitPercent / 100);
      const priceAfterDiscount = priceWithProfit * (1 - discountPercent / 100);

      return {
        selling_price: priceWithProfit.toFixed(2),
        final_price: priceAfterDiscount.toFixed(2),
      };
    }
    return { selling_price: "", final_price: "" };
  };

  // Handle base price change
  const handleBasePriceChange = (e) => {
    const value = e.target.value;
    setProductBasePrice(value);
    updateVariationPrices(value);
  };

  // Update all variation prices when base price changes
  const updateVariationPrices = (newBasePrice) => {
    setVariations(
      variations.map((v) => {
        const prices = calculateSellingPrices(
          v.calculatedWeight,
          v.profit_percentage,
          v.discount_percentage,
          newBasePrice
        );
        return {
          ...v,
          selling_price: prices.selling_price,
          final_price: prices.final_price,
          product_base_price: newBasePrice,
        };
      })
    );
  };

  // Handle weight changes
  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const updatedVariation = {
      ...currentVariation,
      [name]: value,
    };

    if (name === "max_weight") {
      const calculatedWeight = calculateWeight(value);
      updatedVariation.calculatedWeight = calculatedWeight;

      const prices = calculateSellingPrices(
        calculatedWeight,
        currentVariation.profit_percentage,
        currentVariation.discount_percentage
      );

      updatedVariation.selling_price = prices.selling_price;
      updatedVariation.final_price = prices.final_price;
    }

    setCurrentVariation(updatedVariation);
  };

  // Handle other variation changes
  const handleVariationChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedVariation = {
      ...currentVariation,
      [name]: type === "checkbox" ? checked : value,
    };

    const prices = calculateSellingPrices(
      currentVariation.calculatedWeight,
      name === "profit_percentage" ? value : currentVariation.profit_percentage,
      name === "discount_percentage"
        ? value
        : currentVariation.discount_percentage
    );

    updatedVariation.selling_price = prices.selling_price;
    updatedVariation.final_price = prices.final_price;

    setCurrentVariation(updatedVariation);
  };

  // Save or update variation
  const saveVariation = (e) => {
    e.preventDefault();

    if (!productBasePrice) {
      toast.error("Please enter product base price");
      return;
    }

    if (!currentVariation.min_weight || !currentVariation.max_weight) {
      toast.error("Please enter min and max weights");
      return;
    }

    if (
      parseFloat(currentVariation.min_weight) >=
      parseFloat(currentVariation.max_weight)
    ) {
      toast.error("Max weight must be greater than min weight");
      return;
    }

    if (!currentVariation.profit_percentage) {
      toast.error("Please enter profit percentage");
      return;
    }

    if (currentVariation.enable_piece_type && !currentVariation.pieceCount) {
      toast.error("Please enter piece count when piece type is enabled");
      return;
    }

    const prices = calculateSellingPrices(
      currentVariation.calculatedWeight,
      currentVariation.profit_percentage,
      currentVariation.discount_percentage
    );

    const newVariation = {
      ...currentVariation,
      id: currentVariation.id || Date.now(),
      selling_price: prices.selling_price,
      final_price: prices.final_price,
      product_base_price: productBasePrice,
      unit: "kg", // Default unit as per API
    };

    if (currentVariation.id) {
      setVariations(
        variations.map((v) => (v.id === currentVariation.id ? newVariation : v))
      );
      toast.success("Variation updated successfully");
    } else {
      setVariations([...variations, newVariation]);
      toast.success("Variation added successfully");
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setCurrentVariation({
      id: null,
      min_weight: "",
      max_weight: "",
      calculatedWeight: "",
      enable_piece_type: false,
      pieceType: "piece",
      pieceCount: "",
      profit_percentage: "",
      discount_percentage: 0,
      isActive: true,
      selling_price: "",
      final_price: "",
    });
  };

  // Edit variation
  const editVariation = (id) => {
    const variationToEdit = variations.find((v) => v.id === id);
    if (variationToEdit) {
      setCurrentVariation({
        ...variationToEdit,
        calculatedWeight: calculateWeight(variationToEdit.max_weight),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Toggle variation active status
  const toggleActive = (id) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  // Delete variation
  const deleteVariation = (id) => {
    setVariations(variations.filter((v) => v.id !== id));
    if (currentVariation.id === id) {
      resetForm();
    }
    toast.success("Variation deleted successfully");
  };

  // Format price
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  // Submit to API
  const handleSubmit = async () => {
    if (!productId) {
      toast.error("Product ID is required");
      return;
    }

    if (variations.length === 0) {
      toast.error("Please add at least one variation");
      return;
    }

    const payload = variations.map((v) => ({
      product_id: productId,
      product_base_price: parseFloat(v.product_base_price),
      min_weight: parseFloat(v.min_weight),
      max_weight: parseFloat(v.max_weight),
      profit_percentage: parseFloat(v.profit_percentage),
      discount_percentage: parseFloat(v.discount_percentage || 0),
      selling_price: parseFloat(v.selling_price),
      final_price: parseFloat(v.final_price),
      enable_piece_type: v.enable_piece_type,
      unit: v.unit || "kg",
      isActive: v.isActive,
      ...(v.enable_piece_type && {
        pieceType: v.pieceType,
        pieceCount: parseInt(v.pieceCount),
      }),
    }));

    try {
      setIsLoading(true);
      const response = await postData("api/product/product-price-upd", payload);
      if (response.success) {
        toast.success("Prices updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update prices");
      }
    } catch (error) {
      console.error("Error saving prices:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save prices"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="card-title mb-4">Product Price Calculator</h2>

        {/* Base Price */}

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Product Base Price (per kg) *</label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control"
                value={productBasePrice}
                onChange={handleBasePriceChange}
                placeholder="Enter price per kg"
                min={1}
                step="0.01"
              />
            </div>
            <small className="text-muted">
              This will be used to calculate all variations
            </small>
          </div>

          <div className="col-md-6">
            <label className="form-label">Final Price (₹)</label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input
                type="text"
                className="form-control bg-light"
                value={currentVariation.final_price}
                placeholder="After discount"
              />
            </div>
          </div>
        </div>

        {/* Variation Form */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {currentVariation.id ? "Edit Variation" : "Add New Variation"}
            </h5>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Min Weight (gm) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="min_weight"
                  value={currentVariation.min_weight}
                  onChange={handleWeightChange}
                  placeholder="Min weight"
                  min={1}
                  max={1000}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Max Weight (gm) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="max_weight"
                  value={currentVariation.max_weight}
                  onChange={handleWeightChange}
                  placeholder="Max weight"
                  min={1}
                  max={1000}
                />
              </div>
            </div>

            {/* Piece Type Toggle */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="enable_piece_type"
                checked={currentVariation.enable_piece_type}
                onChange={handleVariationChange}
              />
              <label className="form-check-label">
                Enable Piece Type Calculation
              </label>
            </div>

            {/* Piece Type Fields */}
            {currentVariation.enable_piece_type && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Piece Type</label>
                  <select
                    className="form-select"
                    name="pieceType"
                    value={currentVariation.pieceType}
                    onChange={handleVariationChange}
                  >
                    {pieceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Piece Count *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pieceCount"
                    value={currentVariation.pieceCount}
                    onChange={handleVariationChange}
                    placeholder="Count"
                    min={1}
                  />
                </div>
              </div>
            )}

            {/* Pricing Fields */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Profit (%) *</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="profit_percentage"
                    value={currentVariation.profit_percentage}
                    onChange={handleVariationChange}
                    placeholder="Profit %"
                    min={1}
                    max={100}
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Discount (%)</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="discount_percentage"
                    value={currentVariation.discount_percentage}
                    onChange={handleVariationChange}
                    placeholder="Discount %"
                    min={0}
                    max={100}
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Selling Price (₹)</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={currentVariation.selling_price}
                    readOnly
                    placeholder="Calculated price"
                  />
                </div>
              </div>

              {/* <div className="col-md-3">
                <label className="form-label">Final Price (₹)</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={currentVariation.final_price}
                    readOnly
                    placeholder="After discount"
                  />
                </div>
              </div> */}
            </div>

            <div className="d-flex justify-content-end gap-2">
              {currentVariation.id && (
                <button
                  onClick={resetForm}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
              )}
              <button onClick={saveVariation} className="btn btn-primary">
                {currentVariation.id ? (
                  <>
                    <FaSave className="me-1" /> Update
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" /> Add Variation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Variations Table */}
        {variations.length > 0 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Price Variations</h5>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn btn-success"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Saving...
                  </>
                ) : (
                  "Save All Prices"
                )}
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Min (gm)</th>
                    <th>Max (gm)</th>
                    {variations.some((v) => v.enable_piece_type) && (
                      <th>Piece Type</th>
                    )}
                    {variations.some((v) => v.enable_piece_type) && (
                      <th>Count</th>
                    )}
                    <th>Profit %</th>
                    <th>Discount %</th>
                    <th>Selling Price</th>
                    <th>Final Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variations.map((variation, index) => (
                    <tr key={variation.id}>
                      <td>{variation.min_weight}</td>
                      <td>{variation.max_weight}</td>
                      {variations.some((v) => v.enable_piece_type) && (
                        <td>
                          {variation.enable_piece_type
                            ? variation.pieceType
                            : "-"}
                        </td>
                      )}
                      {variations.some((v) => v.enable_piece_type) && (
                        <td>
                          {variation.enable_piece_type
                            ? variation.pieceCount || "-"
                            : "-"}
                        </td>
                      )}
                      <td>{variation.profit_percentage}%</td>
                      <td>{variation.discount_percentage || 0}%</td>
                      <td>₹{formatPrice(variation.selling_price)}</td>
                      <td>₹{formatPrice(variation.final_price)}</td>
                      <td>
                        <span
                          className={`badge ${
                            variation.isActive ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {variation.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => editVariation(variation.id)}
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteVariation(variation.id)}
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => toggleActive(variation.id)}
                            className="btn btn-sm btn-outline-secondary"
                            title={
                              variation.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {variation.isActive ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceManagementCalculator;
