// BasicCard.js
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import AppBarPage from './appBarPage';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import '../styles.css';
import HandleCustomerCard from './handleCustomerCard';
import Switch from '@mui/material/Switch';


export default function CustomerCard() {

  // const [custVendorList , setCustVendorList ] = useState([]);
  const [customerUniqueNames, setCustomerUniqueNames] = useState([]);
  const [customerDetailsList, setCustomerDetailsList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vendorUniqueNames , setVendorUniqueNames] = useState([]);
  const [vendorDetailsList , setVendorDetailsList] = useState([]);
  const [purchased, setPurchased] = useState(false);

  const handleToggleChange = (e) =>{
    setPurchased(e.target.checked);
  }

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerResponse = await axios.get(`http://localhost:5000/api/customerDetails`);
        // console.log(response.data);
        setCustomerDetailsList(customerResponse.data);

        const vendorResponse = await axios.get(`http://localhost:5000/api/vendorDetails`);
        // console.log(response.data);
        setVendorDetailsList(vendorResponse.data);

        const customerDetailsSet = new Set(customerResponse.data.map((customer) => customer.customer_name));
        const vendorDetailsSet = new Set(vendorResponse.data.map((customer) => customer.customer_name));
        setCustomerUniqueNames(customerDetailsSet);
        setVendorUniqueNames(vendorDetailsSet);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCustomerDetails();
    // fetchVendorDetails();
  }, []);

  // useEffect(() => {
  //   console.log(customerDetailsList);
  //   console.log(vendorDetailsList);
  //   // const tempCustomerDetailsList = custVendorList.filter((custVendor) => custVendor.purchased === 0);
  //   // const tempVendorDetailsList = custVendorList.filter((custVendor) => custVendor.purchased === 1);
  //   const customerDetailsSet = new Set(customerDetailsList.map((customer) => customer.customer_name));
  //   const vendorDetailsSet = new Set(vendorDetailsList.map((customer) => customer.customer_name));
  //   // setCustomerDetailsList(tempCustomerDetailsList);
  //   // setVendorDetailsList(tempVendorDetailsList);
  //   setCustomerUniqueNames(customerDetailsSet);
  //   console.log(customerDetailsSet);
  //   setVendorUniqueNames(vendorDetailsSet);
  //   console.log(customerDetailsSet);
  //   // console.log(customerDetailsSet);
  //   // console.log(vendorDetailsSet);
  // }, []);

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);
  
    if (inputValue === '') {
      purchased
        ? setVendorUniqueNames(Array.from(new Set(vendorDetailsList.map((vendor) => vendor.customer_name))))
        : setCustomerUniqueNames(Array.from(new Set(customerDetailsList.map((customer) => customer.customer_name))));
    } else {

      const uniqueNamesArray = Array.from(purchased ? vendorUniqueNames : customerUniqueNames);
      const filteredNames = uniqueNamesArray.filter((name) => name.toLowerCase().includes(inputValue));
      purchased ? setVendorUniqueNames(filteredNames) : setCustomerUniqueNames(filteredNames);
    }
  };

  const handleCustomerCard = (customerName) => {
    const selectedCustomerDetails = purchased ? vendorDetailsList.filter((vendor) => vendor.customer_name === customerName): customerDetailsList.filter((customer) => customer.customer_name === customerName);
    // console.log(selectedCustomerDetails);
    setSelectedCustomer(selectedCustomerDetails);
  };

  const handleBackToMainView = () => {
    setSelectedCustomer(null);
  };

  return (
    <AppBarPage>
      {selectedCustomer ? (
        <HandleCustomerCard customerDetails={selectedCustomer} purchased={purchased} onBack={handleBackToMainView} />
      ) : (
        <>
          <div style={{display:"flex", justifyContent: "center",alignItems:'center'}}>
            <Switch checked={purchased}
              onChange={handleToggleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <h3>{purchased ?  'Vendor Details' : 'Customer Details' }</h3>
          </div>
          <TextField
            label={purchased ? "Search by Vendor Name" :"Search by Customer Name"}
            variant="standard"
            value={searchInput}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchRoundedIcon />,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            {Array.from(purchased ? vendorUniqueNames : customerUniqueNames).map((name) => {
              const customer = purchased ? Array.isArray(vendorDetailsList) ? vendorDetailsList.find((c) => c.customer_name === name) : null : Array.isArray(customerDetailsList) ? customerDetailsList.find((c) => c.customer_name === name) : null;
              if (!customer || customer === null || customer === undefined) {
                // Handle the case where customer is not found
                return null; // or provide a default value
              }              
              return (
                <Card  key={name.id} sx={{ minWidth: 200, maxWidth: 250, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' }}>
                  <CardContent>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      {customer.customer_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.shop_address}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleCustomerCard(customer.customer_name)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        </>
      )}
    </AppBarPage>
  );
}
