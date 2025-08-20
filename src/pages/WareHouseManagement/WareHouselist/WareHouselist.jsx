import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function WarehouseList() {
  const navigate = useNavigate();

  // Initialize demo warehouse data if localStorage is empty
  const initializeDemoData = () => {
    const demoWarehouses = [
      {
        warehouseName: "Warehouse A",
        location: "New York",
        capacity: "5000 sq ft",
        managerName: "John Doe",
        contactNumber: "123-456-7890",
        warehouseImage: null,
        additionalInfo: "Main warehouse for electronics.",
      },
      {
        warehouseName: "Warehouse B",
        location: "Los Angeles",
        capacity: "3000 sq ft",
        managerName: "Jane Smith",
        contactNumber: "987-654-3210",
        warehouseImage: null,
        additionalInfo: "Storage for clothing and accessories.",
      },
      {
        warehouseName: "Warehouse C",
        location: "Chicago",
        capacity: "7000 sq ft",
        managerName: "Mike Johnson",
        contactNumber: "555-555-5555",
        warehouseImage: null,
        additionalInfo: "Handles heavy machinery and tools.",
      },
    ];

    // Save demo data to localStorage if no warehouses exist
    if (!localStorage.getItem("warehouses")) {
      localStorage.setItem("warehouses", JSON.stringify(demoWarehouses));
    }
  };

  // Call the function to initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  // Retrieve warehouses from localStorage
  const tableData = JSON.parse(localStorage.getItem("warehouses")) || [];

  // State for selected checkboxes
  const [selectedRows, setSelectedRows] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0); // react-paginate uses zero-based indexing
  const rowsPerPage = 5; // Number of rows per page

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle select all checkboxes
  const handleSelectAll = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((row) => row.warehouseName));
    }
  };

  // Pagination logic
  const indexOfLastRow = (currentPage + 1) * rowsPerPage;
  const indexOfFirstRow = currentPage * rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle warehouse deletion
  const handleDelete = (warehouseName) => {
    const updatedWarehouses = tableData.filter(
      (warehouse) => warehouse.warehouseName !== warehouseName
    );
    localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));
    window.location.reload(); // Refresh the page to reflect changes
  };

  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Warehouse List</h4>
            </div>

            <div className="text-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-warehouse")}
              >
                <i data-feather="plus-square"></i>Add Warehouse
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card" style={{ background: "none" }}>
                <div className="card-body">
                  <form className="row row-cols-lg-auto g-3 d-flex align-items-center">
                    <div className="col-md-12 col-xl-3">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupUsername"
                      >
                        Username
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control ps-4"
                          placeholder="Search..."
                        />
                        <i className="mdi mdi-magnify fs-16 position-absolute text-muted top-50 translate-middle-y ms-2"></i>
                      </div>
                    </div>

                    <div className="col-md-12 col-xl-1">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormSelectPref"
                      >
                        Preference
                      </label>
                      <select className="form-select" id="inlineFormSelectPref">
                        <option selected>All</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                    <div className="col-md-12 col-xl-4"></div>

                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormSelectPref"
                      >
                        Preference
                      </label>
                      <select className="form-select" id="inlineFormSelectPref">
                        <option selected>No Action</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table datatable" id="datatable_1">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectedRows.length === tableData.length}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Warehouse Name</th>
                          <th>Location</th>
                          <th>Capacity</th>
                          <th>Manager Name</th>
                          <th>Contact Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.map((row) => (
                          <tr key={row.warehouseName}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(row.warehouseName)}
                                onChange={() => handleCheckboxChange(row.warehouseName)}
                              />
                            </td>
                            <td>{row.warehouseName}</td>
                            <td>{row.location}</td>
                            <td>{row.capacity}</td>
                            <td>{row.managerName}</td>
                            <td>{row.contactNumber}</td>
                            <td className="text-end">
                              <a
                                aria-label="anchor"
                                className="btn btn-sm bg-primary-subtle me-1"
                                data-bs-toggle="tooltip"
                                data-bs-original-title="Edit"
                                onClick={() =>
                                  navigate("/update-warehouse", {
                                    state: { warehouse: row },
                                  })
                                }
                              >
                                <i className="mdi mdi-pencil-outline fs-14 text-primary"></i>
                              </a>
                              <a
                                aria-label="anchor"
                                className="btn btn-sm bg-danger-subtle"
                                data-bs-toggle="tooltip"
                                data-bs-original-title="Delete"
                                onClick={() => handleDelete(row.warehouseName)}
                              >
                                <i className="mdi mdi-delete fs-14 text-danger"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* React Paginate */}
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      pageCount={Math.ceil(tableData.length / rowsPerPage)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"pagination justify-content-end"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      activeClassName={"active"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseList;