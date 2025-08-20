import React, { useEffect, useState } from 'react'
import { postData } from '../utility/Utility';

function HomeComponent({ }) {
    const [dashBoardCounts, setDashBoardCounts] = useState(null);

    const getAdmin = async () => {
        try {
            const res = await postData('/analytics/fetchAnalytics');
            if (res.status) {
                setDashBoardCounts(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAdmin();
    }, []);
    console.log(dashBoardCounts)

    return (
        <>

            <div class="content-page">
                <div class="content mt-4">


                    <div class="container-fluid">

                        <div class="row">


                            <div class="col-md-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="widget-first">

                                            <div class="d-flex align-items-center mb-1">
                                                <p class="mb-0 text-dark fs-16 fw-medium">Total Users</p>
                                            </div>

                                            <div class="d-flex align-items-center mb-2">
                                                <h3 class="mb-0 fs-28 text-dark me-3">{dashBoardCounts?.totalUsers}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="widget-first">

                                            <div class="d-flex align-items-center mb-1">
                                                <p class="mb-0 text-dark fs-16 fw-medium">Total Bookings</p>
                                            </div>

                                            <div class="d-flex align-items-center mb-2">
                                                <h3 class="mb-0 fs-28 text-dark me-3">{dashBoardCounts?.totalBookings}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 col-xl-3">

                                <div class="card">
                                    <div class="card-body">
                                        <div class="widget-first">

                                            <div class="d-flex align-items-center mb-1">
                                                <p class="mb-0 text-dark fs-16 fw-medium">Total Revenue</p>
                                            </div>

                                            <div class="d-flex align-items-center mb-2">
                                                <h3 class="mb-0 fs-28 text-dark me-3">{dashBoardCounts?.totalRevenue}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="widget-first">

                                            <div class="d-flex align-items-center mb-1">
                                                <p class="mb-0 text-dark fs-16 fw-medium">Pending Revenue</p>
                                            </div>

                                            <div class="d-flex align-items-center mb-2">
                                                <h3 class="mb-0 fs-28 text-dark me-3">{dashBoardCounts?.toBeCollected}</h3>
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

export default HomeComponent