import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Footer from "./Common/Footer";
import Header from "./Common/Header";
import Sidebar from "./Common/Sidebar";
import HomeComponent from "./Components/HomeComponent";
import BookingManagementList from "./pages/BookingManagement/BookingManagementList/BookingManagementList";
import AddBooking from "./pages/BookingManagement/AddBooking/AddBooking";
import CategoryList from "./pages/CategoryManagement/CategoryList/CategoryList";
import AddCategory from "./pages/CategoryManagement/AddCategory/AddCategory";
import UpdateCategory from "./pages/CategoryManagement/UpdateCategory/UpdateCategory";
import SubCategorylist from "./pages/SubCategoryManagement/SubCategorylist/SubCategorylist";
import AddSubcategory from "./pages/SubCategoryManagement/AddSubCategory/AddSubCategory";
import UpdateSubcategory from "./pages/SubCategoryManagement/UpdateSubCategory/UpdateSubCategory";
import RoleManagementList from "./pages/RoleManagement/RoleManagementList/RoleManagementList";
import AddRole from "./pages/RoleManagement/AddRole/AddRole";
import UpdateRole from "./pages/RoleManagement/UpdateRole/UpdateRole";
import SettingManagement from "./pages/SeetingManagement/SettingManagement";
import AddProduct from "./pages/ProductManagement/AddProduct/AddProduct";
import ProductList from "./pages/ProductManagement/ProductList/ProductList";
import VendorManagementList from "./pages/VenderManagement/VenderManagementlist/VenderManagementlist";
import UpdateVendorManagement from "./pages/VenderManagement/UpdateVenderManagement/UpdateVenderManagement";
import AddVenderManagement from "./pages/VenderManagement/AddVenderManagement/AddVenderManagement";
import UpdateProduct from "./pages/ProductManagement/UpdateProduct/UpdateProduct";
import AddWarehouseManagement from "./pages/WareHouseManagement/AddWareHouse/AddWareHouse";
import UpdateWarehouseManagement from "./pages/WareHouseManagement/UpdateWareHouse/UpdateWareHouse";
import WarehouseList from "./pages/WareHouseManagement/WareHouselist/WareHouselist";
import AddEmploy from "./pages/EmpolyManagement/AddEmpoly/AddEmploy";
import UpdateEmploy from "./pages/EmpolyManagement/UpdateEmploy/UpdateEmploy";
import EmployeeList from "./pages/EmpolyManagement/EmpoltlistManagement/EmpoltlistManagement";
import Loginpage from "./pages/loginpage/loginpage";
import AddRoleRegister from "./pages/RoleRegisterManagement/AddRoleRegister/AddRoleRegister";
import OrderlistManagement from "./pages/OrderManagement/OrderlistManagement/OrderlistManagement";
import WarehouseOrderAssignment from "./pages/PurchaserManagement/PurchaserOrderManagement/WarehouseOrderAssignment/WarehouseOrderAssignment";
import UserManagementList from "./pages/UserManagement/UserManagementlist/UserManagementList";
import UserDetails from "./pages/UserManagement/UserDetails/UserDetails";
import AddPriceManagement from "./pages/PriceManagement/AddPrice/AddPriceManagement";
import LevelManagement from "./pages/LevelManagement/LevelManagement";
import AddDeliveryFees from "./pages/DeliveryFeesManagement/AddDeliveryFees/AddDeliveryFees";
import ProductPriceManagemet from "./pages/ProductPriceManagemet/ProductPriceManagemet";
import { useState } from "react";
import PartnerDetails from "./pages/PartnerManagement/PartnerDetails/PartnerDetails";
import PartnerManagementList from "./pages/PartnerManagement/PartnerManagement/PartnerManagement";
import AddPartners from "./pages/PartnerManagement/AddPartnerManagement/AddPartners";
import AddUsers from "./pages/UserManagement/AddUser/AddUser";
import BookingManagement from "./pages/BookingManagement/BookingManagement";
import BookingDetails from "./pages/BookingManagement/BookingDetails";
import ServiceCategory from "./pages/ServiceCategoryMangament/ServiceCategory";
import AddUServiceCategory from "./pages/ServiceCategoryMangament/AddServiceCategory";
import ServiceManagementList from "./pages/ServiceManagement/ServiceManagement";
import AddService from "./pages/ServiceManagement/AddServiceManagement";
import BannerListing from "./pages/BannerManagement/BannerListing";
import AddBanner from "./pages/BannerManagement/AddBanner";
import BannerDetails from "./pages/BannerManagement/BannerDetails";
import ClickAndView from "./pages/ClickViewManagement/ClickViewManagement";
import ViewServiceCategory from "./pages/ServiceCategoryMangament/ViewServiceCategory";
import ViewService from "./pages/ServiceManagement/ViewService";
import ViewSubCategory from "./pages/SubCategoryManagement/SubCategorylist/ViewSubCategory";
import MyAccount from "./pages/MyAccount";
import MyProfile from "./pages/MyProfile/MyProfile";
import ChildCategorylist from "./pages/ChildCategoryManagement/ChildCategorylist/ChildCategorylist";
import UpdateChildCategory from "./pages/ChildCategoryManagement/UpdateChildCategory/UpdateChildCategory";
import AddChildCategory from "./pages/ChildCategoryManagement/AddChildCategory/AddChildCategory";
import ViewChildCategory from "./pages/ChildCategoryManagement/ChildCategorylist/ViewChildCategory";
import OfferManagement from "./pages/OfferManagement/OfferManagement";
import AddOffer from "./pages/OfferManagement/AddOffer";
import VariantMangement from "./pages/VariantManagement/VariantMangement";
import TypeManagement from "./pages/TypeManagement/TypeManagement";


const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("UrbanAdminToken");

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("UrbanAdminToken");

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

const MainLayout = () => {
  const [isSidebartOpen, setisSidebartOpen] = useState(true);
  const handleToggleMenu = () => {
    if (isSidebartOpen === true) {
      setisSidebartOpen(false);
    } else {
      setisSidebartOpen(true);
    }
  };
  return (
    <>
      {/* <div className="d-sm-flex d-block">
        <div className={isSidebartOpen ? "sideIconSection":"sideIconSectionMobile"} > 
          <Sidebar isSidebartOpen={isSidebartOpen} />
        </div>
        <div className={isSidebartOpen ? "sideOutletSectionTrue":"sideOutletSectionFalse"} >
      <Header handleToggleMenu={handleToggleMenu} />
          <Outlet />
        </div>
      </div> */}/

      <div className="headerSection w-100 position-fixed top-0">
        <Header handleToggleMenu={handleToggleMenu} />
      </div>

      <div className="d-sm-flex d-block  w-100">
        <div className={isSidebartOpen ? "sideIconSection" : "sideIconSectionMobile"} >
          <Sidebar isSidebartOpen={isSidebartOpen} />
        </div>
        <div className={isSidebartOpen ? "sideOutletSectionTrue" : "sideOutletSectionFalse"} >
          <Outlet />
        </div>
      </div>
    </>
  );
};

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Loginpage />} /> */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <Loginpage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/myProfile" element={<MyProfile />} />

          <Route path="/add-booking" element={<AddBooking />} />
          <Route
            path="/booking-management-list"
            element={<BookingManagementList />}
          />
          <Route path="/subcategory-list" element={<SubCategorylist />} />
          <Route path="/add-subcategory" element={<AddSubcategory />} />
          <Route path="/view-subcategory" element={<ViewSubCategory />} />
          <Route path="/update-subcategory" element={<UpdateSubcategory />} />

          <Route path="/childcategory-list" element={<ChildCategorylist />} />
          <Route path="/add-childcategory" element={<AddChildCategory />} />
          <Route path="/view-childcategory" element={<ViewChildCategory />} />
          <Route path="/update-childcategory" element={<UpdateChildCategory />} />

          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/update-category" element={<UpdateCategory />} />
          <Route path="/role-list" element={<RoleManagementList />} />
          <Route path="/add-role" element={<AddRole />} />
          <Route path="/update-role" element={<UpdateRole />} />
          <Route path="/setting" element={<SettingManagement />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product" element={<UpdateProduct />} />
          <Route path="/vendor-list" element={<VendorManagementList />} />
          <Route path="/add-vendor" element={<AddVenderManagement />} />
          <Route path="/update-vendor" element={<AddWarehouseManagement />} />
          <Route
            path="/update-warehouse"
            element={<UpdateWarehouseManagement />}
          />
          <Route path="/add-warehouse" element={<AddWarehouseManagement />} />
          <Route path="/warehouse-list" element={<WarehouseList />} />
          <Route path="/add-employee" element={<AddEmploy />} />
          <Route path="/update-employee" element={<UpdateEmploy />} />
          <Route path="/employ-list" element={<EmployeeList />} />
          <Route path="/register-employee" element={<AddRoleRegister />} />
          <Route path="/order-list" element={<OrderlistManagement />} />
          <Route
            path="/warehouse-orderAssignment"
            element={<WarehouseOrderAssignment />}
          />







          {/* ///////s */}
          <Route path="/user-management" element={<UserManagementList />} />
          <Route path="/myAccount" element={<MyAccount />} />
          <Route path="/add-user" element={<AddUsers />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/add-price" element={<AddPriceManagement />} />
          <Route path="/level-management" element={<LevelManagement />} />
          <Route path="/add-delivery" element={<AddDeliveryFees />} />
          <Route path="/price-management" element={<ProductPriceManagemet />} />
          <Route path="/ViewService" element={<ViewService />} />

          <Route path="/partner-management" element={<PartnerManagementList />} />
          <Route path="/partner-details" element={<PartnerDetails />} />
          <Route path="/add-partner" element={<AddPartners />} />

          <Route path="/booking-management" element={<BookingManagement />} />
          <Route path="/booking-details" element={<BookingDetails />} />

          <Route path="/service-management" element={<ServiceManagementList />} />
          <Route path="/add-services" element={<AddService />} />


          <Route path="/service-category" element={<ServiceCategory />} />
          <Route path="/Add-service-category" element={<AddUServiceCategory />} />
          <Route path="/view-service-category" element={<ViewServiceCategory />} />


          <Route path="/banner-listing" element={<BannerListing />} />
          <Route path="/Add-banner" element={<AddBanner />} />
          <Route path="/banners-details" element={<BannerDetails />} />
          <Route path="/click-view" element={<ClickAndView />} />
          <Route path="/offer-management" element={<OfferManagement />} />
          <Route path="/Add-Offer" element={<AddOffer />} />



          <Route path="/variant-management" element={<VariantMangement />} />
          <Route path="/type-management" element={<TypeManagement />} />



        </Route>
      </Routes>

      {/* <Header/>
      <Sidebar/>
      <HomeComponent/>
      <Footer/> */}
    </>
  );
}

export default App;
