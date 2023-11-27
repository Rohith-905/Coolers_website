// appBarPage.js
import { AppBar, Box, Button, CssBaseline, Grid, Toolbar } from "@mui/material"
import React, { useState } from "react";

import CustomerDetails from './customers';
import AddCustomers from "./addCustomers";

const AppBarPage = ({ children }) => {
    const [customerDetails, setCustomerDetails] = useState(false);
    const [addCustomers, setAddCustomers] = useState(false);
    const [home, setHome] = useState(true);

    const handleCustomerDetails = () => {
        setCustomerDetails(true);
        setAddCustomers(false);
        setHome(false);
    }

    const handleAddCustomers = () => {
        setAddCustomers(true);
        setCustomerDetails(false);
        setHome(false);
    }

    const handleHome = () => {
        setHome(true);
        setCustomerDetails(false);
        setAddCustomers(false);
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar component="nav">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={1}>
                                <Button sx={{ color: '#fff' }} onClick={handleHome}>Home</Button>
                            </Grid>
                            <Grid item xs={8} />
                            <Grid item xs={1}>
                                <Button sx={{ color: '#fff' }} onClick={handleCustomerDetails}>Customers</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button sx={{ color: '#fff' }} onClick={handleAddCustomers}>Add Customer</Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            {
                home ?
                    null
                    : <>{
                        customerDetails ?
                            <CustomerDetails />
                            : <>
                                {
                                    addCustomers ?
                                        <AddCustomers />
                                        : null
                                }
                            </>
                    }
                    </>
            }
            {children}
        </>
    )
}
export default AppBarPage;
