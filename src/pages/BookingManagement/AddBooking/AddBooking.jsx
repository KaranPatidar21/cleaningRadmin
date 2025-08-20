import React, { useState } from "react";
import { postData } from "../../../utility/Utility";


function AddBooking() {

  const [bookingData, setBookingData] = useState({
    userid: "",
    serviceId: "",
    categoryId: "",
    partnerId: "",
    address: "",
    location: " ",
    date: "",
    timeSlot: "",
    bookingStatus: "",
    price: "",
    discountAmount: "",
    totalPrice: "",
    paymentMode: "",
    paymentStatus: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData("/booking/addbooking", bookingData);
      console.log(res, 
        
        
        
        
        
        "response");
      alert("Booking successfully added!");
    } catch (err) {
      console.error("Error posting booking:", err);
      alert("Failed to add booking");
    }
  };



  return (
    <>
      <div class="content-page">
        <div class="content">
          <div class="container-fluid">
            <div class="py-3 d-flex align-items-sm-center flex-sm-row flex-column">
              <div class="flex-grow-1">
                <h4 class="fs-18 fw-semibold m-0">Add Booking</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="card" style={{ background: "none" }}>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-12">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  User ID*
                                </label>
                                <input
                                  type="text"

                                  value={bookingData.userid}
                                  name="userid"
                                  class="form-control"
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Service ID*
                                </label>
                                <input
                                  type="text"

                                  value={bookingData.serviceId}
                                  name="serviceId"
                                  class="form-control"
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Category ID*
                                </label>
                                <input
                                  type="text"

                                  name="categoryId"
                                  value={bookingData.categoryId}
                                  class="form-control"
                                  onChange={handleChange}

                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Partner ID*
                                </label>
                                <input
                                  type="text"
                                  name="partnerId"
                                  value={bookingData.partnerId}
                                  class="form-control"
                                  onChange={handleChange}

                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Address*
                                </label>
                                <input
                                  type="text"
                                  name="address"
                                  value={bookingData.address}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Adress"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Location*
                                </label>
                                <input
                                  type="text"
                                  name="location"
                                  value={bookingData.location}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Adress"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Date*
                                </label>
                                <input
                                  type="date"
                                  name="date"
                                  value={bookingData.date}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Date"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Time Slot*
                                </label>
                                <input
                                  type="timeSlot"
                                  name="timeSlot"
                                  value={bookingData.timeSlot}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Time Slot"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Booking Status*
                                </label>
                                <input
                                  type="text"
                                  name="bookingStatus"
                                  value={bookingData.bookingStatus}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Booking Status"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Price*
                                </label>
                                <input
                                  type="number"
                                  name="price"
                                  value={bookingData.price}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Price"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Discount Amount*
                                </label>
                                <input
                                  type="number"
                                  name="discountAmount"
                                  value={bookingData.discountAmount}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Discount Amount"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Total Price*
                                </label>
                                <input
                                  type="number"
                                  name="totalPrice"
                                  value={bookingData.totalPrice}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Total Price"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div class="mb-3">
                                <label
                                  class="form-label"
                                >
                                  Payment Mode
                                </label>
                                <select
                                  className="form-select"
                                  name="paymentMode"
                                  value={bookingData.paymentMode}
                                  onChange={handleChange}
                                >
                                  <option value="">--Select--</option>
                                  <option value="cash">UPI</option>
                                  <option value="upi">CASH</option>
                                  <option value="card">CARD</option>
                                  <option value="netbanking">NET BANKING</option>
                                  <option value="wallet">Wallet</option>
                                </select>

                              </div>
                            </div>

                            <div className="col-md-4">
                              <div class="mb-3">
                                <label class="form-label">
                                  Payment Status*
                                </label>
                                <input
                                  type="text"
                                  name="paymentStatus"
                                  value={bookingData.paymentStatus}
                                  class="form-control"
                                  onChange={handleChange}
                                  placeholder="Status"
                                />
                              </div>
                            </div>
                            <div className=" ms-auto text-end">
                              <div class="">
                                <button type="submit" class="btn btn-primary">
                                  Submit
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
        </div>
      </div>
    </>
  );
}

export default AddBooking;
