import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LevelManagement() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState({
    id: null,
    levelNumber: 1,
    levelPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Automatically set next level number
  useEffect(() => {
    if (!isEditing && levels.length > 0) {
      const nextLevel = Math.max(...levels.map(l => l.levelNumber)) + 1;
      setCurrentLevel(prev => ({
        ...prev,
        levelNumber: nextLevel,
        levelPercentage: 0
      }));
    }
  }, [levels, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLevel(prev => ({
      ...prev,
      [name]: name === "levelNumber" 
        ? parseInt(value) || 0 
        : parseFloat(value) || 0
    }));
  };

  const validateLevel = () => {
    // Check if level already exists
    const levelExists = levels.some(l => l.levelNumber === currentLevel.levelNumber);
    if (levelExists && !isEditing) {
      toast.error(`Level ${currentLevel.levelNumber} already exists`);
      return false;
    }

    // Percentage validation
    if (currentLevel.levelPercentage < 0 || currentLevel.levelPercentage > 100) {
      toast.error("Percentage must be between 0 and 100");
      return false;
    }

    // For levels after first, check against previous level
    if (currentLevel.levelNumber > 1) {
      const prevLevel = levels.find(l => l.levelNumber === currentLevel.levelNumber - 1);
      if (prevLevel && currentLevel.levelPercentage >= prevLevel.levelPercentage) {
        toast.error(`Must be less than Level ${prevLevel.levelNumber} (${prevLevel.levelPercentage}%)`);
        return false;
      }
    }

    return true;
  };

  const saveLevel = () => {
    if (!validateLevel()) return;

    setLoading(true);

    setTimeout(() => {
      if (isEditing) {
        setLevels(prev => prev.map(l => l.id === currentLevel.id ? currentLevel : l));
        toast.success("Level updated");
      } else {
        const newId = levels.length > 0 ? Math.max(...levels.map(l => l.id)) + 1 : 1;
        setLevels(prev => [...prev, { 
          ...currentLevel, 
          id: newId,
          levelPercentage: parseFloat(currentLevel.levelPercentage.toFixed(2)) // Store with 2 decimal places
        }]);
        toast.success("Level added");
      }

      resetForm();
      setLoading(false);
    }, 500);
  };

  const editLevel = (id) => {
    const levelToEdit = levels.find(l => l.id === id);
    if (levelToEdit) {
      setCurrentLevel({
        ...levelToEdit,
        levelPercentage: parseFloat(levelToEdit.levelPercentage.toFixed(2)) // Ensure 2 decimal places when editing
      });
      setIsEditing(true);
    }
  };

  const deleteLevel = (id) => {
    if (window.confirm("Delete this level?")) {
      setLevels(prev => prev.filter(l => l.id !== id));
      toast.success("Level deleted");
    }
  };

  const resetForm = () => {
    const nextLevel = levels.length > 0 ? Math.max(...levels.map(l => l.levelNumber)) + 1 : 1;
    setCurrentLevel({
      id: null,
      levelNumber: nextLevel,
      levelPercentage: 0
    });
    setIsEditing(false);
  };

  return (
    <div className="content-page">
      <div className="container py-4">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Header with Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Level Management</h2>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i> Back
          </button>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">{isEditing ? "Edit Level" : "Add Level"}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Level Number</label>
                <input
                  type="number"
                  name="levelNumber"
                  className="form-control"
                  value={currentLevel.levelNumber}
                  onChange={handleInputChange}
                  min="1"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-8 mb-3">
                <label className="form-label">
                  Percentage: {currentLevel.levelPercentage.toFixed(2)}%
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  step="0.01"
                  value={currentLevel.levelPercentage}
                  onChange={(e) => handleInputChange({
                    target: { name: "levelPercentage", value: e.target.value }
                  })}
                />
                <input
                  type="number"
                  className="form-control mt-2"
                  name="levelPercentage"
                  value={currentLevel.levelPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveLevel}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                {isEditing ? "Update" : "Add"} Level
              </button>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">Levels</h5>
          </div>
          <div className="card-body">
            {levels.length === 0 ? (
              <div className="text-center py-4">No levels added yet</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Percentage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels
                      .sort((a, b) => a.levelNumber - b.levelNumber)
                      .map(level => (
                        <tr key={level.id}>
                          <td>Level {level.levelNumber}</td>
                          <td>
                            <div className="progress" style={{ height: "20px" }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${level.levelPercentage}%` }}
                              >
                                {level.levelPercentage.toFixed(2)}%
                              </div>
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => editLevel(level.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteLevel(level.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}