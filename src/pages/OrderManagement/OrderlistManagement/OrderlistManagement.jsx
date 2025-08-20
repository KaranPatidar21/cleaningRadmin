import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, deleteData } from "../../../utility/Utility";
import Swal from "sweetalert2";

export default function OrderlistManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const rowsPerPage = 10;

  // Static order data for vegetables and fruits
  const staticOrders = [
    {
      id: 1,
      orderNumber: "ORD-1001",
      customerName: "John Doe",
      items: [
        { name: "Tomatoes", quantity: 2, price: 1.99 },
        { name: "Carrots", quantity: 1, price: 0.99 },
      ],
      totalAmount: 4.97,
      deliveryAddress: "123 Main St, Cityville",
      status: "completed",
      orderDate: "2023-05-15T10:30:00Z",
    },
    {
      id: 2,
      orderNumber: "ORD-1002",
      customerName: "Jane Smith",
      items: [
        { name: "Apples", quantity: 3, price: 0.79 },
        { name: "Bananas", quantity: 2, price: 0.49 },
        { name: "Spinach", quantity: 1, price: 1.29 },
      ],
      totalAmount: 5.12,
      deliveryAddress: "456 Oak Ave, Townsville",
      status: "processing",
      orderDate: "2023-05-16T14:45:00Z",
    },
    {
      id: 3,
      orderNumber: "ORD-1003",
      customerName: "Mike Johnson",
      items: [
        { name: "Potatoes", quantity: 5, price: 0.69 },
        { name: "Onions", quantity: 2, price: 0.89 },
      ],
      totalAmount: 5.23,
      deliveryAddress: "789 Pine Rd, Villageton",
      status: "shipped",
      orderDate: "2023-05-17T09:15:00Z",
    },
    {
      id: 4,
      orderNumber: "ORD-1004",
      customerName: "Sarah Williams",
      items: [
        { name: "Strawberries", quantity: 1, price: 3.99 },
        { name: "Blueberries", quantity: 1, price: 2.99 },
      ],
      totalAmount: 6.98,
      deliveryAddress: "321 Elm Blvd, Hamletville",
      status: "pending",
      orderDate: "2023-05-18T16:20:00Z",
    },
    {
      id: 5,
      orderNumber: "ORD-1005",
      customerName: "David Brown",
      items: [
        { name: "Oranges", quantity: 4, price: 0.59 },
        { name: "Lettuce", quantity: 1, price: 1.49 },
        { name: "Cucumbers", quantity: 2, price: 0.99 },
      ],
      totalAmount: 6.71,
      deliveryAddress: "654 Maple Ln, Boroughburg",
      status: "cancelled",
      orderDate: "2023-05-19T11:10:00Z",
    },
  ];

  // Fetch orders from API or use static data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // In a real app, you would call your API:
      // const response = await getData("api/orders/get-all");
      // if (response?.success) {
      //   setOrders(response?.results);
      //   const count = Math.ceil(response.pagination?.total / rowsPerPage);
      //   setPageCount(count);
      // } else {
      //   toast.error(response?.message || "Failed to fetch orders");
      // }

      // For demo purposes, using static data
      setOrders(staticOrders);
      const count = Math.ceil(staticOrders.length / rowsPerPage);
      setPageCount(count);
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Paginate orders
  const paginatedOrders = filteredOrders.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when applying filters
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(0);
  };

  // Handle order deletion with SweetAlert confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // In a real app, you would call your API:
        // const response = await deleteData(`api/orders/delete/${id}`);
        // if (response.success) {
        //   toast.success("Order deleted successfully");
        //   fetchOrders();
        // } else {
        //   toast.error(response.message || "Failed to delete order");
        // }

        // For demo purposes, just filter out the deleted order
        setOrders(orders.filter((order) => order.id !== id));
        toast.success("Order deleted successfully");
      } catch (error) {
        toast.error("Error deleting order");
        console.error("Delete order error:", error);
      }
    }
  };

  // Get badge color based on order status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success";
      case "processing":
        return "bg-primary";
      case "shipped":
        return "bg-info";
      case "pending":
        return "bg-warning";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content">
        <div className="container-fluid">
          {/* Header Section */}
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column justify-content-between">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">
                Vegetable & Fruit Orders
              </h4>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-order")}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="mdi mdi-plus-square me-1"></i>
                )}
                Add New Order
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                      <div className="col-md-12 col-lg-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control ps-4"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <span className="input-group-text">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-3">
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="col-md-12 col-lg-3 d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          ) : null}
                          Apply Filters
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleReset}
                          disabled={loading}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Delivery Address</th>
                            <th>Status</th>
                            <th>Order Date</th>
                            <th width="120px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order, index) => (
                              <tr key={order.id}>
                                <td>{order.orderNumber}</td>
                                <td>{order.customerName}</td>
                                <td>
                                  <ul className="list-unstyled mb-0">
                                    {order.items.map((item, i) => (
                                      <li key={i}>
                                        {item.quantity}x {item.name} ($
                                        {item.price.toFixed(2)})
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>{order.deliveryAddress}</td>
                                <td>
                                  <span
                                    className={`badge ${getStatusBadgeColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                  </span>
                                </td>
                                <td>
                                  {new Date(
                                    order.orderDate
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() =>
                                        navigate(`/update-order`, {
                                          state: { orderData: order },
                                        })
                                      }
                                    >
                                      <i className="mdi mdi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(order.id)}
                                    >
                                      <i className="mdi mdi-delete"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() =>
                                        navigate(`/order-details/${order.id}`)
                                      }
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center py-4">
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <ReactPaginate
                        previousLabel={<i className="mdi mdi-chevron-left"></i>}
                        nextLabel={<i className="mdi mdi-chevron-right"></i>}
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName="pagination pagination-rounded justify-content-end mt-3"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={currentPage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
