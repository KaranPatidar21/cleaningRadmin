import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Detail = ({ label, value }) => (
  <li className="col-md-6 mb-2">
    <strong>{label}: </strong> {value || 'N/A'}
  </li>
);

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  console.log(order, ":order");

  if (!order) return <p>Loading...</p>;

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content container-fluid">
        <h4 className="fs-18 fw-semibold my-3">Booking Details</h4>

        {/* Booking Info */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5><i className="fas fa-id-card me-2"></i>Booking Information</h5>
          </div>
          <div className="card-body">
            <ul className="row">
              <Detail label="Booking Status" value={order.bookingStatus} />
              <Detail label="Payment Status" value={order.paymentStatus} />
              <Detail label="Total Price" value={`₹${order.totalPrice}`} />
              <Detail label="Discount" value={`₹${order.discountAmount}`} />
              <Detail label="Final Price" value={`₹${order.price}`} />
              <Detail label="Order Date" value={order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} />
              <Detail label="Time Slot" value={`${order?.timeSlot?.start} - ${order?.timeSlot?.end}`} />
              <Detail label="Address" value={order.address} />
            </ul>
          </div>
        </div>

        {/* User Info */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5><i className="fas fa-user me-2"></i>User Details</h5>
          </div>
          <div className="card-body">
            <ul className="row">
              <Detail label="Name" value={order?.user?.name} />
              <Detail label="Email" value={order?.user?.email} />
              <Detail label="Phone" value={order?.user?.phoneNo} />
              <li className="col-md-6 mb-2">
                <strong>Image: </strong>
                <img src={order?.user?.img} alt="User" className="ps-2" height="80" />
              </li>
            </ul>
          </div>
        </div>

        {/* Service Info */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5><i className="fas fa-cogs me-2"></i>Service Details</h5>
          </div>
          <div className="card-body">
            <ul className="row">
              {order?.assignedPartners.map((item, index) => (
                <React.Fragment key={index}>
                  <Detail label="Service Name" value={item.service?.name} />
                  <Detail label="Selling Type" value={item?.service?.sellingType} />
                  <Detail label="Price" value={item?.service?.price} />
                  <Detail label="Time" value={item?.service?.time} />
                  <Detail label="Description" value={item?.service?.description} />
                  <li className="col-md-6 mb-2">
                    <strong>Image: </strong> <br />
                    <img src={item?.service?.icon} alt="Service" className="m-2" height="80" />
                  </li>
                  <hr />
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>

        {/* Cart Details (Category + Sub Category) */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5><i className="fas fa-shopping-cart me-2"></i>Cart Details</h5>
          </div>
          <div className="card-body" >
            {order?.cart?.items?.length > 0 ? (
              order.cart.items.map((item, index) => (
                <div key={index} className="mb-3 border-bottom pb-3">
                  <ul className="row" style={{
                    boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    padding: "20px",
                    paddingLeft:"50px"
                  }}>
                    <Detail label="Category Name" value={item?.category?.name} />
                    <Detail label="Sub Category Name" value={item?.subCategory?.name} />
                    {item?.service && (
                      <>
                        <Detail label="Service Name" value={item.service?.name} />
                        <Detail label="Service Price" value={`₹${item.service?.price}`} />
                      </>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p>No Cart Items Available</p>
            )}
          </div>
        </div>

        {/* Partner Info */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5><i className="fas fa-user-cog me-2"></i>Partner Details</h5>
          </div>
          <div className="card-body">
            <ul className="row">
              <Detail label="Partner Name" value={order?.partner?.name} />
              <Detail label="Email" value={order?.partner?.email} />
              <Detail label="Phone" value={order?.partner?.phoneNo} />
              <li className="col-md-6 mb-2">
                <strong>Image: </strong>
                <img src={order?.partner?.image} alt="Partner" className="ps-2" height="80" />
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/booking-management')}
          >
            <i className="fas fa-arrow-left me-1"></i> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
