import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utility/Utility";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Loginpage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const [formData, setFormData] = useState({
    phoneNo: "",
    otp: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData("admin/login", { phoneNo: formData.phoneNo });

      if (response?.status) {
        toast.dismiss()
        toast.success("OTP sent successfully!");
        setShowOtpField(true);
      } else {
        toast.dismiss()
        toast.error(response?.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.dismiss()
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData("admin/verifyotp", {
        phoneNo: formData.phoneNo,
        otp: formData.otp
      });

      if (response?.status) {
        localStorage.setItem("UrbanAdminToken", response.data.token);
        toast.dismiss()
        toast.success("Login successful!", {
          autoClose: 1500,
          onClose: () => navigate("/home"),
        });
      } else {
        toast.dismiss()
        toast.error(response?.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.dismiss()
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData("admin/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNo: formData.phoneNo,
      });

      if (response?.status) {
        toast.success("Signup successful!");
        setMode("login"); 
      } else {
        toast.error(response?.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="account-page" style={{ height: "100vh"}}>
        <div className="container-fluid p-0" style={{ height: "100%" }}>
          <div className="row g-0 vh-100" style={{ height: "100%" }}>
            <div className="col-xl-6" style={{ height: "100%" }}>
              <div className="row" style={{ height: "100%" }}>
                <div className="col-md-12 mx-auto log" style={{ background: "#fff",height: "100vh" }}>
                  <div className="card card-border ">
                    <div className="card-body ">
                      <img src="assets/images/kwik/top-left.png" alt="" className="top-bot" />
                      <div className="mb-0 p-0 p-lg-2 loginSignupForm">
                        <div className="mb-0 border-0 p-md-4 p-lg-0 m-4">
                          <div className="text-center">
                            <h1></h1>
                          </div>
                          <div className="text-center my-0">
                            <h4 className="text-dark fw-semibold">Welcome</h4>
                            <p className="text-muted">
                              <span
                                style={{ cursor: "pointer", fontWeight: mode === "login" ? "bold" : "normal", color:"#1b4426" }}
                                onClick={() => {
                                  setMode("login");
                                  setShowOtpField(false);
                                }}
                              >
                                Login
                              </span>
                              {" / "}
                              <span
                                style={{ cursor: "pointer", fontWeight: mode === "signup" ? "bold" : "normal", color:"#1b4426" }}
                                onClick={() => {
                                  setMode("signup");
                                  setShowOtpField(false);
                                }}
                              >
                                Signup
                              </span>{" "}
                              to manage your products
                            </p>
                          </div>

                          <form
                            className="my-4"
                            onSubmit={
                              mode === "login"
                                ? showOtpField
                                  ? handleVerifyOtp
                                  : handleSendOtp
                                : handleSignup
                            }
                          >
                            {mode === "signup" && (
                              <>
                                <div className="form-group mb-3">
                                  <label>First Name*</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                                <div className="form-group mb-3">
                                  <label>Last Name*</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                                <div className="form-group mb-3">
                                  <label>Email*</label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                                <div className="form-group mb-3">
                                  <label>Password*</label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </>
                            )}

                            <div className="form-group mb-3">
                              <label>Phone Number*</label>
                              <input
                                className="form-control"
                                type="tel"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                                required
                                placeholder="Enter your phone number"
                                disabled={mode === "login" && showOtpField}
                              />
                            </div>

                            {mode === "login" && showOtpField && (
                              <div className="form-group mb-3">
                                <label>Enter OTP*</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="otp"
                                  value={formData.otp}
                                  onChange={handleChange}
                                  required
                                  placeholder="Enter OTP"
                                />
                              </div>
                            )}

                            <div className="form-group mb-0 mt-3 row">
                              <div className="col-12 mt-5">
                                <div className="d-grid">
                                  <button className="btn btn-primary fw-semibold" type="submit" disabled={loading}>
                                    {loading ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        {mode === "login"
                                          ? showOtpField
                                            ? "Verifying OTP..."
                                            : "Sending OTP..."
                                          : "Registering..."}
                                      </>
                                    ) : mode === "login" ? (
                                      showOtpField ? "Verify OTP" : "Send OTP"
                                    ) : (
                                      "Signup"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <img src="/src/assets/images/kwik/bottom-left.png" alt="" className="top-bot" style={{height:"100%"}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-none d-xl-inline-block log-img-right"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loginpage;
