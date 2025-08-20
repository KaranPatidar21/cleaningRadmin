
import React, { useEffect, useState } from 'react';
import { postData } from '../utility/Utility';

function MyAccount() {
  const [adminDetails, setAdminDetails] = useState(null);

  const getAdmin = async () => {
    try {
      const res = await postData('/admin/fetchProfile');
      if (res.status) {
        setAdminDetails(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <div
      className="modal fade"
      id="myAccountModal"
      tabIndex="-1"
      aria-labelledby="myAccountModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow rounded-4 border-0">

          <div className="modal-header bg-dark text-white rounded-top-4">
            <h5 className="modal-title fw-bold" id="myAccountModalLabel">My Account</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {!adminDetails ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Fetching your profile details...</p>
              </div>
            ) : (
              <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    {adminDetails.firstName} {adminDetails.lastName}
                  </h4>
                  <p className="text-secondary mb-1"><strong>Email:</strong> {adminDetails.email}</p>
                  <p className="text-secondary mb-0"><strong>Phone:</strong> {adminDetails.phoneNo}</p>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light rounded-bottom-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
