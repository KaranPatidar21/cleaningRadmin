import React, { useState } from 'react';

export default function CompanySettings() {
  // State to manage form data
  const [formData, setFormData] = useState({
    company_name: '',
    company_address: '',
    company_city: '',
    company_state: '',
    company_zipcode: '',
    company_country: '',
    company_telephone: '',
    registration_number: '',
    company_start_time: '',
    company_end_time: '',
    ip_restrict: false,
    timezone: '',
    vat_gst_number_switch: true,
    tax_type: 'GST',
    vat_number: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add API call or further processing here
  };

  return (
    <div id="company-settings" className="card">
      <div className="card-header">
        <h5>Company Settings</h5>
        <small className="text-muted">Edit your company details</small>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="row">
            {/* Company Name */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_name" className="form-label">
                Company Name *
              </label>
              <input
                className="form-control font-style"
                placeholder="Enter Company Name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Address */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_address" className="form-label">
                Address
              </label>
              <input
                className="form-control font-style"
                placeholder="Enter Company Address"
                name="company_address"
                type="text"
                value={formData.company_address}
                onChange={handleInputChange}
              />
            </div>

            {/* Company City */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_city" className="form-label">
                City
              </label>
              <input
                className="form-control font-style"
                placeholder="Enter Company City"
                name="company_city"
                type="text"
                value={formData.company_city}
                onChange={handleInputChange}
              />
            </div>

            {/* Company State */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_state" className="form-label">
                State
              </label>
              <input
                className="form-control font-style"
                placeholder="Enter Company State"
                name="company_state"
                type="text"
                value={formData.company_state}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Zip/Post Code */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_zipcode" className="form-label">
                Zip/Post Code
              </label>
              <input
                className="form-control"
                placeholder="Enter Company Zip"
                name="company_zipcode"
                type="text"
                value={formData.company_zipcode}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Country */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_country" className="form-label">
                Country
              </label>
              <input
                className="form-control font-style"
                placeholder="Enter Company Country"
                name="company_country"
                type="text"
                value={formData.company_country}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Telephone */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="company_telephone" className="form-label">
                Telephone
              </label>
              <input
                className="form-control"
                placeholder="Enter Company Telephone"
                name="company_telephone"
                type="text"
                value={formData.company_telephone}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Registration Number */}
            <div className="form-group col-md-6 my-2">
              <label htmlFor="registration_number" className="form-label">
                Company Registration Number
              </label>
              <input
                className="form-control"
                placeholder="Enter Company Registration Number"
                name="registration_number"
                type="text"
                value={formData.registration_number}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Start Time */}
            <div className="form-group col-md-4 my-2">
              <label htmlFor="company_start_time" className="form-label">
                Company Start Time
              </label>
              <input
                className="form-control"
                name="company_start_time"
                type="time"
                value={formData.company_start_time}
                onChange={handleInputChange}
              />
            </div>

            {/* Company End Time */}
            <div className="form-group col-md-4 my-2">
              <label htmlFor="company_end_time" className="form-label">
                Company End Time
              </label>
              <input
                className="form-control"
                name="company_end_time"
                type="time"
                value={formData.company_end_time}
                onChange={handleInputChange}
              />
            </div>

            {/* IP Restrict Switch */}
            <div className="form-group col-md-4 my-2">
              <label className="" htmlFor="ip_restrict">
                IP Restrict
              </label>
              <div className="custom-control custom-switch mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="ip_restrict"
                  id="ip_restrict"
                  checked={formData.ip_restrict}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Timezone */}
            <div className="form-group col-md-12 mt-2">
              <label htmlFor="timezone" className="form-label">
                Timezone
              </label>
              <select
                name="timezone"
                className="form-control custom-select"
                id="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
              >
                <option value="">Select Timezone</option>
                <option value="Asia/Kolkata">(GMT+5:30) Asia/Kolkata (India Standard Time)</option>
                {/* Add more timezone options as needed */}
              </select>
            </div>

            {/* Tax Number Switch */}
            <div className="form-group col-md-6 my-2">
              <div className="row mt-4">
                <div className="col-md-6 my-2">
                  <label htmlFor="vat_gst_number_switch">Tax Number</label>
                  <div className="form-check form-switch custom-switch-v1 float-end">
                    <input
                      type="checkbox"
                      name="vat_gst_number_switch"
                      className="form-check-input input-primary pointer"
                      checked={formData.vat_gst_number_switch}
                      onChange={handleInputChange}
                      id="vat_gst_number_switch"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Type and VAT/GST Number */}
            {formData.vat_gst_number_switch && (
              <div className="form-group col-md-6 my-2 tax_type_div">
                <div className="row">
                  <div className="col-md-6 my-2">
                    <div className="form-check form-check-inline form-group mb-3">
                      <input
                        type="radio"
                        id="customRadio8"
                        name="tax_type"
                        value="VAT"
                        className="form-check-input"
                        checked={formData.tax_type === 'VAT'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="customRadio8">
                        VAT Number
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 my-2">
                    <div className="form-check form-check-inline form-group mb-3">
                      <input
                        type="radio"
                        id="customRadio7"
                        name="tax_type"
                        value="GST"
                        className="form-check-input"
                        checked={formData.tax_type === 'GST'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="customRadio7">
                        GST Number
                      </label>
                    </div>
                  </div>
                </div>
                <input
                  className="form-control"
                  placeholder="Enter VAT / GST Number"
                  name="vat_number"
                  type="text"
                  value={formData.vat_number}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Add more fields here if needed */}
            {/* Example: Additional Input Field */}
            {/* <div className="form-group col-md-6 my-2">
              <label htmlFor="additional_field" className="form-label">
                Additional Field
              </label>
              <input
                className="form-control"
                placeholder="Enter Additional Field"
                name="additional_field"
                type="text"
                value={formData.additional_field}
                onChange={handleInputChange}
              />
            </div> */}
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