import React, { useEffect, useState } from 'react';
import { postData } from '../../utility/Utility';

import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Avatar,
    Stack,
    Divider,
    TextField,
    Button,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function MyProfile() {
    const [adminDetails, setAdminDetails] = useState(null);
    const [showChange, setshowChange] = useState(false)
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
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        console.log("New Password:", newPassword);
        console.log("Confirm Password:", confirmPassword);
        // Add your password update logic here
    };

    useEffect(() => {
        getAdmin();
    }, []);

    if (!adminDetails) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="60vh"
            >
                <CircularProgress color="primary" />
                <Typography mt={2} color="text.secondary">
                    Fetching your profile details...
                </Typography>
            </Box>
        );
    }

    return (
        <>

            {showChange ? <>
                <Box className="content-page" p={2}>
                    <Card elevation={3} sx={{ width: '100%' }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="h6" fontWeight="bold">
                                    Change Password
                                </Typography>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={2}>
                                <TextField
                                    label="New Password"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Stack>

                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{ mt: 3 }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </CardContent>
                    </Card>
                </Box></> : <><Box className="content-page" p={2}>
                    <Card elevation={3} sx={{ width: '100%' }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#1b4426', width: 64, height: 64 }}>
                                    <PersonIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {adminDetails.firstName} {adminDetails.lastName}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Admin Profile
                                    </Typography>
                                </Box>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <EmailIcon color="action" />
                                    <Typography>Email: {adminDetails.email}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PhoneIcon color="action" />
                                    <Typography>Phone: {adminDetails.phoneNo}</Typography>
                                </Stack>
                            </Stack>
                            <button className='btn btn-success btn-sm mt-4' onClick={() => setshowChange(true)}>Chnage Password</button>
                        </CardContent>
                    </Card>
                </Box></>}

        </>
    );
}

export default MyProfile;
