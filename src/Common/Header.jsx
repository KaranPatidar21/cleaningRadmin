import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyAccount from "../pages/MyAccount";
import { postData } from "../utility/Utility";
import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png"

function Header({ handleToggleMenu }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Function to toggle user dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsLanguageDropdownOpen(false); // Close language dropdown when user dropdown is opened
  };

  // Function to toggle language dropdown
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    setIsDropdownOpen(false); // Close user dropdown when language dropdown is opened
  };

  const handleLogout = async () => {
    localStorage.clear("");
    navigate("/");
  };
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
    <>
      <div className="topbar-custom">
        <div className="container-fluid">
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-5">
              <div className="logso-box1 ogosBoxSidebar">
                <Link className="logo1 logo-dark1" to="/">
                  <span className="logo-lg   d-flex align-items-center justify-content-center ogosBoxSidebar">
                    <img
                      src={logo}
                      alt="Farm Fusion"
                      style={{ width: "120px", height: "70px" }}
                      className="img-fluid ms-1 mb-0"
                    />
                  </span>
                </Link>
              </div>
              <ul className="list-unstyled topnav-menu mb-0 d-flex align-items-center">
                <FaBars className="text-white ms-4" onClick={handleToggleMenu} style={{ cursor: "pointer" }} />
              </ul>

            </div>
            {/* <ul className="list-unstyled topnav-menu mb-0 d-flex align-items-center">
             <FaBars className="text-white ms-4" onClick={handleToggleMenu} style={{cursor:"pointer"}}/>
            </ul> */}
            <ul className="list-unstyled topnav-menu mb-0 d-flex align-items-center">
              <li className="dropdown notification-list topbar-dropdown">
                <a
                  className="nav-link dropdown-toggle nav-user me-0"
                  onClick={toggleDropdown}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <img
                    src="/assets/images/users/user-13.jpg"
                    alt="user-image"
                    className="rounded-circle"
                  />
                  <span className="pro-user-name ms-1">
                    {adminDetails?.firstName}
                  </span>
                </a>

                <div
                  className={`dropdown-menu dropdown-menu-end profile-dropdown ${isDropdownOpen ? "show profileshow" : ""
                    }`}
                >
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">Welcome !</h6>
                  </div>

                  <Link
                    className="dropdown-item notify-item"
                    to="/myProfile"
                  >
                    <i className="fas fa-user-circle"></i>{" "}
                    <span>My Account</span>
                  </Link>
                  <div className="dropdown-divider"></div>

                  <a
                    className="dropdown-item notify-item"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <MyAccount />
      </div>
    </>
  );
}

export default Header;
