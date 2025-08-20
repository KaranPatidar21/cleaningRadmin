import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getData } from "../utility/Utility";
import logo from "../assets/logo.png"
// Define all possible menu items outside the component
const allMenuItems = [
  {
    id: 9,
    title: "Banner Management",
    icon: "	fa-solid fa-image",
    link: "/banner-listing",
    roles: ["admin"],
  },
  {
    id: 9,
    title: "Offer Management",
    icon: "	fa-solid fa-image",
    link: "/offer-management",
    roles: ["admin"],
  },
  {
    id: 1,
    title: "User Management",
    icon: "fa-solid fa-user-shield",
    link: "/user-management",
    roles: ["admin"],
  },
  // {
  //   id: 2,
  //   title: "Partner Management",
  //   icon: "	fa-solid fa-handshake",
  //   link: "/partner-management",
  //   roles: ["admin"],
  // },
  // {
  //   id: 3,
  //   title: "Booking Management",
  //   icon: "fa-solid fa-clipboard-list",
  //   link: "/booking-management",
  //   roles: ["admin", "purchaser"],
  // },
  // {
  //   id: 4,
  //   title: "Payment Management",
  //   icon: "fa-solid fa-money-check-dollar",
  //   link: "/price-management",
  //   roles: ["admin", "purchaser"],
  // },
  {
    id: 5,
    title: "Category Management",
    icon: "fa-solid fa-gears",
    link: "/service-category",
    roles: ["admin"],
  },
  {
    id: 6,
    title: "Sub Category Management",
    icon: "fa-solid fa-gears",
    link: "/subcategory-list",
    roles: ["admin"],
  },
  {
    id: 6,
    title: "Child Category Management",
    icon: "fa-solid fa-gears",
    link: "/childcategory-list",
    roles: ["admin"],
  },
  {
    id: 7,
    title: "Variant Management",
    icon: "fa-solid fa-gears",
    link: "/variant-management",
    roles: ["admin"],
  },
  {
    id: 8,
    title: "Type Management",
    icon: "fa-solid fa-gears",
    link: "/type-management",
    roles: ["admin"],
  },
  {
    id: 9,
    title: "Service Management",
    icon: "fa-solid fa-screwdriver-wrench",
    link: "/service-management",
    roles: ["admin", "purchaser"],
  },
  // {
  //   id: 10,
  //   title: "Clicks & Views Management",
  //   icon: "fa-solid fa-eye",
  //   link: "/click-view",
  //   roles: ["admin"],
  // },

];

function Sidebar({ isSidebartOpen }) {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  // const userDetails = async () => {
  //   try {
  //     const response = await getData("api/user/profile");
  //     console.log({ response });

  //     if (response?.success) {
  //       // Assuming the role is in response.user.role
  //       setRole(response?.user?.role_name?.toLowerCase() || "");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  useEffect(() => {
    // Load Font Awesome if not already loaded
    if (!document.querySelector('[href*="font-awesome"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(link);
    }

    // userDetails();
  }, []);

  // Filter menu items based on role
  const getFilteredMenuItems = () => {
    if (!role) return []; // Return empty while loading

    return allMenuItems
      .filter((item) => {
        // Include if item is for all roles or includes current role
        return item.roles.includes("all") || item.roles.includes(role);
      })
      .map((item) => {
        // Also filter sub-items if they exist
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(
              (subItem) =>
                subItem.roles.includes("all") || subItem.roles.includes(role)
            ),
          };
        }
        return item;
      })
      .filter((item) => {
        // Remove parent items that have no sub-items (if they had sub-items originally)
        if (item.subItems && item.subItems.length === 0) return false;
        return true;
      });
  };

  const handleMenuClick = (link) => {
    if (activeMenu === link) {
      setActiveMenu(null);
    } else {
      setActiveMenu(link);
    }
  };

  const handleLinkClick = (e, link, hasSubItems) => {
    e.preventDefault();
    if (!hasSubItems) {
      navigate(link);
    }
  };

  const menuItems = getFilteredMenuItems();

  const handleLogout = async () => {
    localStorage.clear("");
    navigate("/");
  };

  return (
    <div className="app-sidebar-menu">
      <div className="sidebar-menu-inner" data-simplebar>
        <div id="sidebar-menu" className="">
          {/* <div className="logso-box ogosBoxSidebar">
            <Link className="logo logo-dark" to="/">
              <span className="logo-lg">
                <img
                  src={logo}
                  alt="Farm Fusion"
                  style={{ width: "65px", height: "65px" }}
                  className="img-fluid mt-3 ms-1"
                />
              </span>
            </Link>
          </div>
          <hr /> */}

          <ul id="side-menu" className="overflow-y-auto ">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className={location.pathname === item.link ? "active" : ""}
                  onClick={(e) => {
                    handleMenuClick(item.link);
                    handleLinkClick(e, item.link, item.subItems);
                  }}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {isSidebartOpen ? <span>{item.title}</span> : ""}
                  {item.subItems && <span className="menu-arrow"></span>}
                </a>
                {item.subItems && (
                  <div
                    className={`collapse ${activeMenu === item.link ? "show profileshow" : ""
                      }`}
                    id={item.link.substring(1)}
                  >
                    <ul className="nav-second-level">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            className="tp-link"
                            href={subItem.link}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(subItem.link);
                            }}
                          >
                            {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="sidebarLogoutWrapper">
            <button
              onClick={handleLogout}
              className="btn btn-danger sidebarLogOutBtn"
            >

              {isSidebartOpen ? <i className="fas fa-sign-out-alt me-2"></i> : <i className="fas fa-sign-out-alt d-flex justify-content-center align-items-center "></i>}
              {isSidebartOpen ? "Logout" : ""}

            </button>
          </div>

        </div>

        {/* <div
          className="sidebar-footer"
          style={{ padding: "20px", borderTop: "1px solid #eee" }}
        >
          <div className="user-profile d-flex align-items-center mb-3">
            <div className="user-info">
              <span className="user-name d-block">{}</span>
              <span className="user-role text-muted text-capitalize">
                {role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-block"
            style={{ width: "100%" }}
          >
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </div> */}
        <div className="clearfix"></div>
      </div>
    </div>
  );
}

export default Sidebar;
