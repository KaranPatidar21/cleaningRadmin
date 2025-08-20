import React, { useState } from "react";
import { FaTrash, FaToggleOn, FaToggleOff, FaEdit } from "react-icons/fa";

const PriceCalculator = ({variations,setVariations}) => {
  const pieceOptions = [
    { value: "piece", label: "Piece" },
    { value: "bunch", label: "Bunch" },
    { value: "dozen", label: "Dozen" },
    { value: "packet", label: "Packet" },
    { value: "kg", label: "Kilogram" },
  ];

  const [product_base_price, setproduct_base_price] = useState("");
  const [currentVariation, setCurrentVariation] = useState({
    id: null,
    min_weight: "",
    max_weight: "",
    calculatedWeight: "",
    enable_piece_type: false,
    pieceType: "piece",
    pieceCount: "",
    profit_percentage: "",
    discount_percentage: "",
    isActive: true,
    selling_price: "",
    final_price: "",
  });

  const calculateWeight = (max) => {
    return parseFloat(max) || 0;
  };

  const calculateSellingPrices = (weight, profit_percentage, discount_percentage) => {
    const price = parseFloat(product_base_price) || 0;
    const weightVal = parseFloat(weight) || 0;
    const profit_percentagePercent = parseFloat(profit_percentage) || 0;
    const discountPercent = parseFloat(discount_percentage) || 0;

    if (price && weightVal && profit_percentagePercent) {
      const pricePerGm = price / 1000;
      const priceWithprofit_percentage =
        pricePerGm * weightVal * (1 + profit_percentagePercent / 100);
      const priceAfterDiscount = priceWithprofit_percentage * (1 - discountPercent / 100);

      return {
        selling_price: priceWithprofit_percentage.toFixed(2),
        final_price: Math.round(priceAfterDiscount).toFixed(2),
      };
    }
    return { selling_price: "", final_price: "" };
  };

  const handleproduct_base_priceChange = (e) => {
    const value = e.target.value;
    setproduct_base_price(value);
    setVariations(
      variations.map((v) => {
        const prices = calculateSellingPrices(
          v.calculatedWeight,
          v.profit_percentage,
          v.discount_percentage
        );
        return {
          ...v,
          selling_price: prices.selling_price,
          final_price: prices.final_price,
        };
      })
    );
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const updatedVariation = {
      ...currentVariation,
      [name]: value,
    };

    // Calculate weight whenever max changes
    if (name === "max_weight") {
      const calculatedWeight = calculateWeight(value);
      updatedVariation.calculatedWeight = calculatedWeight;

      const prices = calculateSellingPrices(
        calculatedWeight,
        currentVariation.profit_percentage,
        currentVariation.discount_percentage
      );

      updatedVariation.selling_price = prices.selling_price;
      updatedVariation.final_price =
        prices.final_price;
    }

    setCurrentVariation(updatedVariation);
  };

  const handleVariationChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedVariation = {
      ...currentVariation,
      [name]: type === "checkbox" ? checked : value,
    };

    const prices = calculateSellingPrices(
      currentVariation.calculatedWeight,
      name === "profit_percentage" ? value : currentVariation.profit_percentage,
      name === "discount_percentage" ? value : currentVariation.discount_percentage
    );

    updatedVariation.selling_price = prices.selling_price;
    updatedVariation.final_price =
      prices.final_price;

    setCurrentVariation(updatedVariation);
  };

  const saveVariation = (e) => {
    e.preventDefault();
    if (
      !product_base_price ||
      !currentVariation.min_weight ||
      !currentVariation.max_weight ||
      !currentVariation.profit_percentage
    ) {
      alert("Please fill all  fields");
      return;
    }

    if (currentVariation.enable_piece_type && !currentVariation.pieceCount) {
      alert("Please fill piece count when piece type is enabled");
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
      product_base_price,
    };

    if (currentVariation.id) {
      setVariations(
        variations.map((v) => (v.id === currentVariation.id ? newVariation : v))
      );
    } else {
      setVariations([...variations, newVariation]);
    }

    setCurrentVariation({
      id: null,
      min_weight: "",
      max_weight: "",
      calculatedWeight: "",
      enable_piece_type: false,
      pieceType: "piece",
      pieceCount: "",
      profit_percentage: "",
      discount_percentage: "",
      isActive: true,
      selling_price: "",
      final_price: "",
      product_base_price,
    });
  };

  const editVariation = (id) => {
    const variationToEdit = variations.find((v) => v.id === id);
    if (variationToEdit) {
      setCurrentVariation({
        ...variationToEdit,
        // Ensure calculatedWeight is set based on max_weight
        calculatedWeight: calculateWeight(variationToEdit.max_weight),
      });
    }
  };

  const toggleActive = (id) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const deleteVariation = (id) => {
    setVariations(variations.filter((v) => v.id !== id));
    // If deleting the currently edited variation, reset the form
    if (currentVariation.id === id) {
      setCurrentVariation({
        id: null,
        min_weight: "",
        max_weight: "",
        calculatedWeight: "",
        enable_piece_type: false,
        pieceType: "piece",
        pieceCount: "",
        profit_percentage: "",
        discount_percentage: "",
        isActive: true,
        selling_price: "",
        final_price: "",
      });
    }
  };

  return (
    <div className="container">
      <h2>Product Price Calculator</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Base Price */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">
                      Product Base Price* (per kg)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={product_base_price}
                      onChange={handleproduct_base_priceChange}
                      placeholder="Enter price per kg"
                      
                      min={1}
                    />
                  </div>
                </div>
              </div>

              {/* Weight Fields */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Min Weight (gm)*</label>
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
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Max Weight (gm)*</label>
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
              </div>

              {/* Piece Type Toggle */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="enable_piece_type"
                      checked={currentVariation.enable_piece_type}
                      onChange={handleVariationChange}
                      id="pieceTypeCheckbox"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="pieceTypeCheckbox"
                    >
                      Enable Piece Type Calculation
                    </label>
                  </div>
                </div>
              </div>

              {/* Piece Type Fields */}
              {currentVariation.enable_piece_type && (
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Piece Type</label>
                      <select
                        className="form-control"
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
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Piece Count*</label>
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
                </div>
              )}

              {/* profit_percentage and Discount Fields */}
              <div className="row mb-4 border-bottom pb-3">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Profit (%)*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="profit_percentage"
                      value={currentVariation.profit_percentage}
                      onChange={handleVariationChange}
                      placeholder="profit_percentage %"
                      
                      min={1}
                      max={100}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Discount (%)</label>
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
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">SP (₹)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentVariation.selling_price}
                      readOnly
                      placeholder="Price"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">SP After Discount (₹)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentVariation.final_price}
                      readOnly
                      placeholder="Final price"
                    />
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={saveVariation}
                  >
                    {currentVariation.id ? "Update" : "Add"}
                  </button>
                </div>
              </div>

              {/* Variations Table */}
              {variations.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Min Weight</th>
                        <th>Max Weight</th>
                        <th>Weight Used</th>
                        {variations.some((v) => v.enable_piece_type) && (
                          <th>Piece Type</th>
                        )}
                        {variations.some((v) => v.enable_piece_type) && (
                          <th>Piece Count</th>
                        )}
                        <th>profit (%)</th>
                        <th>SP (₹)</th>
                        <th>Discount (%)</th>
                        <th>SP After Discount (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((variation, index) => (
                        <tr key={variation.id}>
                          <td>{index + 1}</td>
                          <td>{variation.min_weight}</td>
                          <td>{variation.max_weight}</td>
                          <td>{variation.calculatedWeight}</td>
                          {variations.some((v) => v.enable_piece_type) && (
                            <td>{variation.pieceType}</td>
                          )}
                          {variations.some((v) => v.enable_piece_type) && (
                            <td>{variation.pieceCount || "-"}</td>
                          )}
                          <td>{variation.profit_percentage}</td>
                          <td>{variation.selling_price}</td>
                          <td>{variation.discount_percentage || "0"}</td>
                          <td>{variation.final_price}</td>
                          <td>
                            <span
                              className={`badge ${
                                variation.isActive
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {variation.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => editVariation(variation.id)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger me-2"
                              onClick={() => deleteVariation(variation.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => toggleActive(variation.id)}
                              title={
                                variation.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {variation.isActive ? (
                                <FaToggleOn size={20} />
                              ) : (
                                <FaToggleOff size={20} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No variations added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
