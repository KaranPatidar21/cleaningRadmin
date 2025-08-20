import React, { useState } from 'react';
import Header from '../../../Common/Header'
import Sidebar from '../../../Common/Sidebar'
import { useNavigate } from 'react-router-dom';
function BookingManagementList() {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('/add-booking'); // Navigate to the About page
  };
  const tableData = [
    {
      id: 1,
      User: { name: 'Create A New React app', image: '/src/assets/images/users/user.jpg' },
      status: { text: 'In-Progress', class: 'bg-warning-subtle text-warning' },
      assignedTo: 'Alexander White',
      deadline: 'Due in 3 days',
      priority: 'High',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-2.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 3,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-3.jpg' },
      status: { text: 'Completed', class: 'bg-success-subtle text-success' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 4,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-4.jpg' },
      status: { text: 'In-Progress', class: 'bg-warning-subtle text-warning' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-5.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-6.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-7.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-8.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-9.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    {
      id: 2,
      User: { name: 'Finish project report', image: '/src/assets/images/users/user-10.jpg' },
      status: { text: 'Pending', class: 'bg-primary-subtle text-primary' },
      assignedTo: 'Sophia Williams',
      deadline: '15 August 2024',
      priority: 'Medium',
    },
    // Add more rows as needed
  ];

  // State for selected checkboxes
  const [selectedRows, setSelectedRows] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
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
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //   const navigate = useNavigate();



  return (
    <>
      <Header />
      <Sidebar />
      <div class="content-page">
        <div class="content">


          <div class="container-fluid">

            <div class="py-3 d-flex align-items-sm-center flex-sm-row flex-column">
              <div class="flex-grow-1">
                <h4 class="fs-18 fw-semibold m-0">Booking List</h4>
              </div>

              <div class="text-end">
                <button className='btn btn-primary ' onClick={handleButtonClick}> <i data-feather="plus-square"></i>Add Booking</button>
              </div>
            </div>


            <div class="row">
              <div class="col-12">
                <div class="card" style={{ background: "none" }}>
                  <div class="card-body">
                    <form class="row row-cols-lg-auto g-3 d-flex align-items-center">
                      <div class="col-md-12 col-xl-3">
                        <label class="visually-hidden" for="inlineFormInputGroupUsername">Username</label>
                        <div class="input-group">
                          <input type="text" class="form-control ps-4" placeholder="Search..." />
                          <i class="mdi mdi-magnify fs-16 position-absolute text-muted top-50 translate-middle-y ms-2"></i>

                        </div>
                      </div>

                      <div class="col-md-12 col-xl-1">
                        <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
                        <select class="form-select" id="inlineFormSelectPref">
                          <option selected>All</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                      </div>
                      <div class="col-md-12 col-xl-4"></div>
                      <div class="col-12">
                        <label class="visually-hidden" for="inlineFormInputGroupUsername">Username</label>
                        <div class="input-group">
                          <div class="input-group-text">Filter </div>
                          <div class="input-group-text"><i data-feather="filter"></i></div>

                        </div>
                      </div>

                      <div class="col-12">
                        <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
                        <select class="form-select" id="inlineFormSelectPref">
                          <option selected>No Action</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                      </div>




                      <div class="col-12">
                        <button type="submit" class="btn btn-primary">Apply</button>
                      </div>
                    </form>


                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-2">
              <div class="col-12">
                <div class="card">

                  <div class="card-body">
                    <div class="table-responsive">
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
                            <th>User</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Deadline</th>
                            <th>Priority</th>
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
                              <td className="ps-0">
                                <img
                                  src={row.User.image}
                                  alt=""
                                  className="thumb-md me-2 rounded-circle avatar-border"
                                />
                                <p className="d-inline-block align-middle mb-0">
                                  <span>{row.User.name}</span>
                                </p>
                              </td>
                              <td>
                                <span className={`badge ${row.status.class}`}>{row.status.text}</span>
                              </td>
                              <td>{row.assignedTo}</td>
                              <td>{row.deadline}</td>
                              <td>{row.priority}</td>
                              <td className="text-end">
                                <a
                                  aria-label="anchor"
                                  className="btn btn-sm bg-primary-subtle me-1"
                                  data-bs-toggle="tooltip"
                                  data-bs-original-title="Edit"
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
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div>
                        <nav >
                          <ul>
                            {Array.from({ length: Math.ceil(tableData.length / rowsPerPage) }).map((_, index) => (
                              <li key={index} className={`page-item  ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link " onClick={() => paginate(index + 1)}>
                                  {index + 1}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </nav>
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
  )
}

export default BookingManagementList