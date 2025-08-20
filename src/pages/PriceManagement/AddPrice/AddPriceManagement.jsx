import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceMnagementCalculator from "../../../Components/PriceMnagementCalculator";
import { postData } from "../../../utility/Utility";
import { useNavigate } from "react-router-dom";

const AddPriceManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="content-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="content">
        <div className="container-fluid">
          <PriceMnagementCalculator productId="eb9cf206-0287-49e7-80e7-121c6fc64267" />
        </div>
      </div>
    </div>
  );
};

export default AddPriceManagement;
