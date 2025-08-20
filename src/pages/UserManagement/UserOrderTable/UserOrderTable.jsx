import React, { useState } from "react";

export default function UserOrderTable() {
  // Static vegetable order data with booking date, quantity, and location
  const staticOrders = [
    {
      id: 101,
      customer: "Raj Sharma",
      vegetables: [
        { name: "Tomato", quantity: 2, unit: "kg", price: 30 },
        { name: "Potato", quantity: 5, unit: "kg", price: 20 },
        { name: "Onion", quantity: 3, unit: "kg", price: 25 },
      ],
      bookingDate: "2023-06-10T08:45:00",
      deliveryDate: "2023-06-12",
      total: 235,
      status: "pending",
      location: "123 Green Park, Delhi",
      paymentMethod: "UPI",
    },
    {
      id: 102,
      customer: "Priya Patel",
      vegetables: [
        { name: "Carrot", quantity: 1, unit: "kg", price: 40 },
        { name: "Beans", quantity: 2, unit: "kg", price: 35 },
        { name: "Cabbage", quantity: 1, unit: "pc", price: 20 },
      ],
      bookingDate: "2023-06-09T14:30:00",
      deliveryDate: "2023-06-11",
      total: 130,
      status: "received",
      location: "456 Flower Lane, Mumbai",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: 103,
      customer: "Amit Singh",
      vegetables: [
        { name: "Brinjal", quantity: 3, unit: "kg", price: 25 },
        { name: "Cucumber", quantity: 4, unit: "pc", price: 15 },
        { name: "Spinach", quantity: 1, unit: "bunch", price: 10 },
      ],
      bookingDate: "2023-06-08T11:15:00",
      deliveryDate: "2023-06-10",
      total: 145,
      status: "canceled",
      location: "789 Orchard Road, Bangalore",
      paymentMethod: "Credit Card",
    },
  ];

  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState(staticOrders);

  // Filter orders
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      pending: "bg-warning",
      received: "bg-success",
      canceled: "bg-danger",
    };
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4"> Orders History</h2>

      {/* Filter buttons */}
      <div className="btn-group mb-4">
        <button
          className={`btn ${
            filter === "all" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter("all")}
        >
          All Orders
        </button>
        <button
          className={`btn ${
            filter === "pending" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`btn ${
            filter === "received" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter("received")}
        >
          Received
        </button>
        <button
          className={`btn ${
            filter === "canceled" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter("canceled")}
        >
          Canceled
        </button>
      </div>

      {/* Orders table */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Booking Date</th>
              <th>Delivery Date</th>
              <th>Vegetables (Quantity)</th>
              <th>Total (₹)</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{formatDate(order.bookingDate)}</td>
                  <td>{order.deliveryDate}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.vegetables.map((veg, index) => (
                        <li key={index}>
                          {veg.name} ({veg.quantity} {veg.unit})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.total}</td>
                  <td>{order.location}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    {order.status === "pending" && (
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            updateOrderStatus(order.id, "received")
                          }
                        >
                          <i className="bi bi-check"></i> Receive
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            updateOrderStatus(order.id, "canceled")
                          }
                        >
                          <i className="bi bi-x"></i> Cancel
                        </button>
                      </div>
                    )}
                    {order.status !== "pending" && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          alert(`Viewing details for order #${order.id}`)
                        }
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
