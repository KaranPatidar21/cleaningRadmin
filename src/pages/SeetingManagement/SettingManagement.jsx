import React, { useState } from 'react';
import BrandSettings from '../../Common/Setting/BrandSettings';
import CompanySettings from '../../Common/Setting/CompanySettings';

export default function SettingManagement() {
  const [activeTab, setActiveTab] = useState('brand');

  return (
    <div className="content-page">
      <div className="content">
        <div className="container-fluid">
          <div className="py-3 d-flex align-items-sm-center flex-sm-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold m-0">Setting Management</h4>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <ul className="nav nav-tabs nav-tabs-custom">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'brand' ? 'active' : ''}`}
                        onClick={() => setActiveTab('brand')}
                      >
                        Brand Setting
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'company' ? 'active' : ''}`}
                        onClick={() => setActiveTab('company')}
                      >
                        Company Setting
                      </button>
                    </li>
                  </ul>

                  {/* Tabs Content */}
                  <div className="tab-content mt-3">
                    {activeTab === 'brand' && <BrandSettings/>}
                    {activeTab === 'company' && (
                      <div className="tab-pane fade show active">

                        <CompanySettings/>
                      </div>
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