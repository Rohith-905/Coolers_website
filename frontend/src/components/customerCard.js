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

export default function CustomerCard() {
  const [customerDetails, setCustomerDetails] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customerDetails');
        setCustomerDetails(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    const namesSet = new Set(customerDetails.map((customer) => customer.customer_name));
    setUniqueNames(namesSet);
  }, [customerDetails]);

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);

    if (inputValue === '') {
      setUniqueNames(Array.from(new Set(customerDetails.map((customer) => customer.customer_name))));
    } else {
      const uniqueNamesArray = Array.from(uniqueNames);
      const filteredNames = uniqueNamesArray.filter((name) => name.toLowerCase().includes(inputValue));
      setUniqueNames(filteredNames);
    }
  };

  const handleCustomerCard = (customerName) => {
    const selectedCustomerDetails = customerDetails.filter((customer) => customer.customer_name === customerName);
    console.log(selectedCustomerDetails);
    setSelectedCustomer(selectedCustomerDetails);
  };

  const handleBackToMainView = () => {
    setSelectedCustomer(null);
  };

  return (
    <AppBarPage>
      {selectedCustomer ? (
        <HandleCustomerCard customerDetails={selectedCustomer} onBack={handleBackToMainView} />
      ) : (
        <>
          <TextField
            label="Search by Customer Name"
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
            {Array.from(uniqueNames).map((name) => {
              const customer = customerDetails.find((c) => c.customer_name === name);
              return (
                <Card  key={customer.id} sx={{ minWidth: 200, maxWidth: 250, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' }}>
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
