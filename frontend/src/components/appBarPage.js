// appBarPage.js
import { AppBar, Box, Button, CssBaseline, Grid, Toolbar } from "@mui/material"
import React from "react";
import HomeIcon from '@mui/icons-material/Home';

import { useNavigate } from "react-router-dom";

const AppBarPage = ({ children }) => {

    const navigate = useNavigate();

    const handleRawMaterialDetails = () => {
        navigate('/rawMaterials');
    }

    const handleAddRawMaterials = () => {
        navigate('/addRawMaterials');
    }

    const handleCustomerDetails = () => {
        navigate('/customers');
    }

    const handleAddCustomers = () => {
        navigate('/addCustomers');
    }

    const handleHome = () => {
        navigate('/home');
    }

    const handleLogout = () => {
        navigate('/logout');
    }

    return (
        <>
            <Box sx={{ display: 'flex',padding:'20px' }}>
                <CssBaseline />
                <AppBar component="nav">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={1}>
                                <Button sx={{
                                    color: '#fff',
                                    borderRadius: '50%',
                                    }}onClick={handleHome}>
                                <HomeIcon />
                                </Button>
                            </Grid>
                            <Grid item xs={2} />
                            <Grid item xs={2}>
                                <Button sx={{ color: '#fff' }} onClick={handleCustomerDetails}>Customers</Button>
                            </Grid>
                            <Grid item xs={2} >
                                <Button sx={{ color: '#fff' }} onClick={handleAddCustomers}>Add Customer</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button sx={{ color: '#fff' }} onClick={handleRawMaterialDetails}>Raw Material</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button sx={{ color: '#fff' }} onClick={handleAddRawMaterials}>Add Raw Material</Button>
                            </Grid>
                            <Grid item xs={1}>
                                <Button sx={{ color: '#fff' }} onClick={handleLogout}>Logout</Button>
                            </Grid>
                            
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            {children}
        </>
    )
}
export default AppBarPage;
