import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function WarehouseOrderAssignment() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const rowsPerPage = 10;

  // Static order data simplified
  const staticOrders = [
    {
      id: 1,
      orderNumber: "ORD-1001",
      orderDate: "2023-05-15T10:30:00Z",
      warehouse: "Main Warehouse",
      items: [
        { name: "Tomatoes", quantity: 2, status: "assigned" },
        { name: "Carrots", quantity: 1, status: "picked" }
      ]
    },
    {
      id: 2,
      orderNumber: "ORD-1002",
      orderDate: "2023-05-16T14:45:00Z",
      warehouse: "North Warehouse",
      items: [
        { name: "Apples", quantity: 3, status: "assigned" },
        { name: "Bananas", quantity: 2, status: "packed" }
      ]
    },
    {
      id: 3,
      orderNumber: "ORD-1003",
      orderDate: "2023-05-17T09:15:00Z",
      warehouse: "South Warehouse",
      items: [
        { name: "Potatoes", quantity: 5, status: "packed" },
        { name: "Onions", quantity: 2, status: "transferred" }
      ]
    },
    {
      id: 4,
      orderNumber: "ORD-1004",
      orderDate: "2023-05-18T16:20:00Z",
      warehouse: "Main Warehouse",
      items: [
        { name: "Strawberries", quantity: 1, status: "transferred" },
        { name: "Blueberries", quantity: 1, status: "transferred" }
      ]
    },
    {
      id: 5,
      orderNumber: "ORD-1005",
      orderDate: "2023-05-19T11:10:00Z",
      warehouse: "East Warehouse",
      items: [
        { name: "Oranges", quantity: 4, status: "cancelled" },
        { name: "Grapes", quantity: 2, status: "cancelled" }
      ]
    }
  ];

  // Fetch orders from API or use static data
  const fetchOrders = async () => {
    setLoading(true);
    try {
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
      order.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ||
      order.items.some(item => item.status.toLowerCase() === statusFilter.toLowerCase());

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
    setCurrentPage(0);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(0);
  };

  // Handle order deletion
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
        setOrders(orders.filter((order) => order.id !== id));
        toast.success("Order deleted successfully");
      } catch (error) {
        toast.error("Error deleting order");
        console.error("Delete order error:", error);
      }
    }
  };

  // Update item status
  const updateItemStatus = (orderId, itemName, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.name === itemName) {
            return { ...item, status: newStatus };
          }
          return item;
        });
        
        return {
          ...order,
          items: updatedItems
        };
      }
      return order;
    }));
    
    toast.success(`Updated status for ${itemName} to ${newStatus}`);
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "assigned": return "bg-primary";
      case "picked": return "bg-info";
      case "packed": return "bg-secondary";
      case "transferred": return "bg-success";
      case "cancelled": return "bg-danger";
      default: return "bg-secondary";
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
                Warehouse Order Assignment
              </h4>
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
                          <option value="assigned">Assigned</option>
                          <option value="picked">Picked</option>
                          <option value="packed">Packed</option>
                          <option value="transferred">Transferred</option>
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
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Order #</th>
                            <th>Order Date</th>
                            <th>Warehouse</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th width="100px">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order) => (
                              <tr key={order.id}>
                                <td>{order.orderNumber}</td>
                                <td>
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                                <td>{order.warehouse}</td>
                                <td>
                                  <ul className="list-unstyled mb-0">
                                    {order.items.map((item, i) => (
                                      <li key={i} className="d-flex justify-content-between">
                                        <span>
                                          {item.quantity}x {item.name}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                                <td>
                                  <ul className="list-unstyled mb-0">
                                    {order.items.map((item, i) => (
                                      <li key={i}>
                                        <select
                                          className={`form-select form-select-sm ${getStatusBadgeColor(item.status)}`}
                                          style={{ width: '120px' }}
                                          value={item.status}
                                          onChange={(e) => updateItemStatus(order.id, item.name, e.target.value)}
                                        >
                                          <option value="assigned">Assigned</option>
                                          <option value="picked">Picked</option>
                                          <option value="packed">Packed</option>
                                          <option value="transferred">Transferred</option>
                                          <option value="cancelled">Cancelled</option>
                                        </select>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(order.id)}
                                    >
                                      <i className="mdi mdi-delete"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-4">
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