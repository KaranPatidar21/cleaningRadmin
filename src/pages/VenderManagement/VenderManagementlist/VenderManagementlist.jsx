import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function VendorManagementList() {
  const navigate = useNavigate();

  // Sample vendor data
  const tableData = [
    {
      id: 1,
      name: "Vendor 1",
      email: "vendor1@example.com",
      mobile: "1234567890",
      state: "California",
      district: "Los Angeles",
      aadhar: "1234 5678 9012",
      pan: "ABCDE1234F",
      status: { text: "Active", class: "bg-success-subtle text-success" },
      createdBy: "Admin",
      createdAt: "2023-10-01",
    },
    {
      id: 2,
      name: "Vendor 2",
      email: "vendor2@example.com",
      mobile: "9876543210",
      state: "Texas",
      district: "Houston",
      aadhar: "9876 5432 1098",
      pan: "FGHIJ5678K",
      status: { text: "Inactive", class: "bg-danger-subtle text-danger" },
      createdBy: "Admin",
      createdAt: "2023-09-15",
    },
    {
      id: 3,
      name: "Vendor 3",
      email: "vendor3@example.com",
      mobile: "5555555555",
      state: "New York",
      district: "Manhattan",
      aadhar: "5555 5555 5555",
      pan: "LMNOP9012Q",
      status: { text: "Active", class: "bg-success-subtle text-success" },
      createdBy: "Admin",
      createdAt: "2023-08-20",
    },
    // Add more vendors as needed
  ];

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
      setSelectedRows(tableData.map((row) => row.id));
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

  return (
    <>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column">
              <div className="flex-grow-1">
                <h4 className="fs-18 fw-semibold m-0">Vendor List</h4>
              </div>

              <div className="text-end">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/add-vendor")}
                >
                  <i data-feather="plus-square"></i>Add Vendor
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
                                checked={
                                  selectedRows.length === tableData.length
                                }
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th>Vendor Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>State</th>
                            <th>District</th>
                            <th>Aadhar</th>
                            <th>PAN</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Created At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRows.map((row) => (
                            <tr key={row.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(row.id)}
                                  onChange={() => handleCheckboxChange(row.id)}
                                />
                              </td>
                              <td>{row.name}</td>
                              <td>{row.email}</td>
                              <td>{row.mobile}</td>
                              <td>{row.state}</td>
                              <td>{row.district}</td>
                              <td>{row.aadhar}</td>
                              <td>{row.pan}</td>
                              <td>
                                <span className={`badge ${row.status.class}`}>
                                  {row.status.text}
                                </span>
                              </td>
                              <td>{row.createdBy}</td>
                              <td>{row.createdAt}</td>
                              <td className="text-end">


                                <div className="d-flex ">

                                <a
                                  aria-label="anchor"
                                  className="btn btn-sm bg-primary-subtle me-1"
                                  data-bs-toggle="tooltip"
                                  data-bs-original-title="Edit"
                                  onClick={() =>
                                    navigate("/update-vendor", {
                                      state: { vendorData: row },
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
                                >
                                  <i className="mdi mdi-delete fs-14 text-danger"></i>
                                </a>
                                </div>
                               
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
    </>
  );
}

export default VendorManagementList;