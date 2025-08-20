import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function EmployeeList() {
  const navigate = useNavigate();

  // Sample employee data with only purchaser and warehouse positions
  const employeeData = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "John Doe",
      email: "john.doe@example.com",
      department: "Warehouse",
      position: "Warehouse Manager",
      status: { text: "Active", class: "bg-success-subtle text-success" },
      joinDate: "2023-01-15",
      phone: "+1 555-123-4567",
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "Purchasing",
      position: "Senior Purchaser",
      status: { text: "Active", class: "bg-success-subtle text-success" },
      joinDate: "2022-11-20",
      phone: "+1 555-987-6543",
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      department: "Warehouse",
      position: "Warehouse Associate",
      status: { text: "On Leave", class: "bg-warning-subtle text-warning" },
      joinDate: "2023-03-10",
      phone: "+1 555-456-7890",
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Emily Davis",
      email: "emily.d@example.com",
      department: "Purchasing",
      position: "Junior Purchaser",
      status: { text: "Active", class: "bg-success-subtle text-success" },
      joinDate: "2022-09-05",
      phone: "+1 555-789-0123",
    },
    {
      id: 5,
      employeeId: "EMP005",
      name: "Michael Brown",
      email: "michael.b@example.com",
      department: "Warehouse",
      position: "Warehouse Supervisor",
      status: { text: "Inactive", class: "bg-danger-subtle text-danger" },
      joinDate: "2021-12-15",
      phone: "+1 555-234-5678",
    },
  ];

  // State for selected checkboxes
  const [selectedRows, setSelectedRows] = useState([]);
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  // State for department filter
  const [departmentFilter, setDepartmentFilter] = useState("All");
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

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
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  // Filter data based on search term and department
  const filteredData = employeeData.filter((employee) => {
    const matchesSearch = Object.values(employee).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDepartment = 
      departmentFilter === "All" || 
      employee.department.toLowerCase().includes(departmentFilter.toLowerCase());
    
    return matchesSearch && matchesDepartment;
  });

  // Pagination logic
  const indexOfLastRow = (currentPage + 1) * rowsPerPage;
  const indexOfFirstRow = currentPage * rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Employee List</h4>
            </div>

            <div className="text-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add-employee")}
              >
                <i className="mdi mdi-plus-circle-outline me-1"></i>Add Employee
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card" style={{ background: "none" }}>
                <div className="card-body">
                  <form className="row row-cols-lg-auto g-3 d-flex align-items-center">
                    <div className="col-md-12 col-xl-4">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control ps-4"
                          placeholder="Search employees..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                          }}
                        />
                        <i className="mdi mdi-magnify fs-16 position-absolute text-muted top-50 translate-middle-y ms-2"></i>
                      </div>
                    </div>

                    <div className="col-md-12 col-xl-2">
                      <select 
                        className="form-select" 
                        value={departmentFilter}
                        onChange={(e) => {
                          setDepartmentFilter(e.target.value);
                          setCurrentPage(0);
                        }}
                      >
                        <option value="All">All Departments</option>
                        <option value="Purchasing">Purchasing</option>
                        <option value="Warehouse">Warehouse</option>
                      </select>
                    </div>

                    <div className="col-md-12 col-xl-2">
                      <select className="form-select" defaultValue="All">
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>

                    <div className="col-md-12 col-xl-2"></div>

                    <div className="col-12">
                      <select className="form-select" defaultValue="No Action">
                        <option value="No Action">No Action</option>
                        <option value="Activate">Activate Selected</option>
                        <option value="Deactivate">Deactivate Selected</option>
                        <option value="Delete">Delete Selected</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <button type="button" className="btn btn-primary">
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
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={
                                selectedRows.length === filteredData.length &&
                                filteredData.length > 0
                              }
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Position</th>
                          <th>Status</th>
                          <th>Join Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.length > 0 ? (
                          currentRows.map((employee) => (
                            <tr key={employee.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(employee.id)}
                                  onChange={() => handleCheckboxChange(employee.id)}
                                />
                              </td>
                              <td>{employee.employeeId}</td>
                              <td>{employee.name}</td>
                              <td>{employee.email}</td>
                              <td>{employee.department}</td>
                              <td>{employee.position}</td>
                              <td>
                                <span className={`badge ${employee.status.class}`}>
                                  {employee.status.text}
                                </span>
                              </td>
                              <td>{employee.joinDate}</td>
                              <td className="text-end">
                                <button
                                  className="btn btn-sm bg-primary-subtle me-1"
                                  onClick={() =>
                                    navigate("/update-employee", {
                                      state: { employeeData: employee },
                                    })
                                  }
                                >
                                  <i className="mdi mdi-pencil-outline fs-14 text-primary"></i>
                                </button>
                                <button className="btn btn-sm bg-danger-subtle">
                                  <i className="mdi mdi-delete fs-14 text-danger"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">
                              No employees found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* React Paginate */}
                    {filteredData.length > rowsPerPage && (
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={Math.ceil(filteredData.length / rowsPerPage)}
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
                        forcePage={currentPage}
                      />
                    )}
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

export default EmployeeList;