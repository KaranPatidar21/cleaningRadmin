import React, { useState } from "react";

// Reusable File Upload Component
const FileUpload = ({ label, name, id, onChange, imageSrc }) => (
  <div className="choose-files mt-5">
    <label htmlFor={id}>
      <input
        type="file"
        name={name}
        id={id}
        className="form-control file"
        onChange={onChange}
      />
    </label>
    {imageSrc && (
      <img src={imageSrc} alt={label} className="img_setting mt-3" />
    )}
  </div>
);

// Reusable Form Input Component
const FormInput = ({ label, type, name, placeholder, value, onChange }) => (
  <div className="form-group col-md-3">
    <label htmlFor={name} className="form-label">
      {label}
    </label>
    <input
      className="form-control"
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function BrandSettings() {
  const [formData, setFormData] = useState({
    title_text: "",
    footer_text: "",
    default_language: "en", // Default language is English
    SITE_RTL: false,
    company_logo_dark: null,
    company_logo_light: null,
    company_favicon: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add API call or further processing here
  };

  return (
    <div id="brand-settings" className="card">
      <form onSubmit={handleSubmit}>
        <div className="card-header">
          <h5>Brand Settings</h5>
          <small className="text-muted">Edit your brand details</small>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Logo Dark Section */}
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="card logo_card">
                <div className="card-header">
                  <h5>Logo Dark</h5>
                </div>
                <div className="card-body pt-0">
                  <FileUpload
                    label="Choose file here"
                    name="company_logo_dark"
                    id="company_logo_dark"
                    onChange={handleFileChange}
                    imageSrc={
                      formData.company_logo_dark
                        ? URL.createObjectURL(formData.company_logo_dark)
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            {/* Logo Light Section */}
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="card logo_card">
                <div className="card-header">
                  <h5>Logo Light</h5>
                </div>
                <div className="card-body pt-0">
                  <FileUpload
                    label="Choose file here"
                    name="company_logo_light"
                    id="company_logo_light"
                    onChange={handleFileChange}
                    imageSrc={
                      formData.company_logo_light
                        ? URL.createObjectURL(formData.company_logo_light)
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            {/* Favicon Section */}
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="card logo_card">
                <div className="card-header">
                  <h5>Favicon</h5>
                </div>
                <div className="card-body pt-0">
                  <FileUpload
                    label="Choose file here"
                    name="company_favicon"
                    id="company_favicon"
                    onChange={handleFileChange}
                    imageSrc={
                      formData.company_favicon
                        ? URL.createObjectURL(formData.company_favicon)
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            {/* Title Text Input */}
            <FormInput
              label="Title Text"
              type="text"
              name="title_text"
              placeholder="Title Text"
              value={formData.title_text}
              onChange={handleInputChange}
            />

            {/* Footer Text Input */}
            <FormInput
              label="Footer Text"
              type="text"
              name="footer_text"
              placeholder="Enter Footer Text"
              value={formData.footer_text}
              onChange={handleInputChange}
            />

            {/* Default Language Dropdown */}
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="default_language" className="form-label">
                  Default Language
                </label>
                <select
                  name="default_language"
                  id="default_language"
                  className="form-control select"
                  value={formData.default_language}
                  onChange={handleInputChange}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="bn">Bengali</option>
                  <option value="gu">Gujarati</option>
                  <option value="kn">Kannada</option>
                  <option value="mr">Marathi</option>
                  <option value="pa">Punjabi</option>
                  <option value="ml">Malayalam</option>
                  <option value="or">Odia</option>
                  <option value="ur">Urdu</option>
                  <option value="as">Assamese</option>
                  <option value="sa">Sanskrit</option>
                  <option value="ne">Nepali</option>
                  <option value="sd">Sindhi</option>
                  <option value="kok">Konkani</option>
                  <option value="mni">Manipuri</option>
                  <option value="doi">Dogri</option>
                  <option value="brx">Bodo</option>
                  <option value="sat">Santali</option>
                  <option value="ks">Kashmiri</option>
                  <option value="mai">Maithili</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="card-footer text-end">
          <div className="form-group">
            <input
              className="btn btn-print-invoice btn-primary m-r-10"
              type="submit"
              value="Save Changes"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
