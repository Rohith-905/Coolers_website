// frontend/src/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

import CustomerDetails from './customers';

const Home = () => {
  const [coolers, setCoolers] = useState([]);
  const [error,setError] = useState(' ');
  const [customerDetails,setCustomerDetails] = useState(false);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handleCustomerDetails = () =>{
    setCustomerDetails(true);
  }

  try{
    // Fetch data from your API endpoint
    axios.get('http://localhost:5000/api/coolers_available') // Replace with your actual API endpoint
      .then(response => {
        setCoolers(response.data); // Assuming your API returns an array of user objects
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  catch (err) {
    // Handle login error
    setError('Invalid username or password');
  }

  
  return (
    <div>
          {customerDetails?
            <CustomerDetails/>
            :
            <>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                  <button onClick={handleCustomerDetails}>Customer Details</button>
                    <h2>Available Coolers</h2>

                    {coolers.length > 0 ? (
                      <div>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="center">Name</StyledTableCell>
                              <StyledTableCell align="center">Quantity Available</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {coolers.map((cooler) => (
                              <StyledTableRow key={cooler.id}>
                                <StyledTableCell align="center">{cooler.model_name}</StyledTableCell>
                                <StyledTableCell align="center">{cooler.quantity}</StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p>No coolers available</p>
                    )}

                    {error && <p>{error}</p>}
                  </Grid>
                </Grid>
              </div>
            </>
          }
    </div>
  );
};
export default Home;
