import React, { useState, useEffect } from "react";
import { postData } from "../../../utility/Utility";
import { toast,ToastContainer } from "react-toastify";

function PartnerListingModal({ isOpen, onClose, selectedBookingId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await postData("booking/fetchNearbyPartners", {
        bookingId:selectedBookingId
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };
   const handleUpdatePartner = async (partnerId) => {
  try {
    const response = await postData("booking/manualAssignPartner", {
      bookingId: selectedBookingId,
      partnerId: partnerId,
      
    });

    if (response.status) {
      toast.success(response.message);
       setTimeout(() => {
        onClose(); 
      }, 1500);
    } else {
      toast.error(response.message || "Assignment failed");
    }
  } catch (error) {
    console.error("Assign partner error:", error);
    toast.error("Something went wrong");
  }
};


  if (!isOpen) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="modal show d-block custom-modal" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Partner</h5>
               <ToastContainer position="top-right" autoClose={1500} />
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* <form onSubmit={handleSubmit} className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn btn-primary" type="submit">
                  Search
                </button>
              </form> */}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-hover text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}  onClick={() => handleUpdatePartner(user._id)} style={{cursor:"pointer"}}>
                            <td>
                              <img
                                src={user.image || "https://via.placeholder.com/40"}
                                alt={user.name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNo}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No partners found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerListingModal;
