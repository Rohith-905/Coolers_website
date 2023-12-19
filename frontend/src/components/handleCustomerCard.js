// handleCustomerCard.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableRow, TableCell, TableHead, Paper, Button } from '@mui/material';
import axios from 'axios';

const HandleCustomerCard = ({ customerDetails, onBack }) => {

  const [error,setError] = useState('');
  const [remainingAmount,setRemainingAmount] = useState();
  const remainingAmountColor = remainingAmount < 0 ? 'green' : 'red';
  const advance_or_due = remainingAmount < 0 ? 'Advance' : 'Due';

  let customerName ='';
  // Group customer details by date
  const groupedByDate = {};
  customerDetails.forEach((customer) => {
    const date = customer.date;
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(customer);
  });

  const handleAmountDetails = async() =>{
    customerDetails.forEach((customer) => { customerName = customer.customer_name})
    try {
      // console.log(customerName);
      const response = await axios.post('http://localhost:5000/api/get_amountDetails', {
        name: customerName,
      });
      if (response.status === 200) {
        setRemainingAmount(response.data.remaining);
      } else {
        console.error('Failed to add coolers:', response.statusText);
        setError('Failed to add coolers');
      }
    } catch (error) {
      console.error('Error adding coolers:', error);
      setError('Error adding coolers');
    }
  }
  useEffect(() => {
    handleAmountDetails();
  });

  return (
    <div>
      <Button onClick={onBack}>Back</Button>
      
      <div style={{ textAlign: 'right', color: remainingAmountColor, fontWeight:'bold' }}>
        {advance_or_due} : {remainingAmount}
      </div>
      {Object.entries(groupedByDate).map(([date, details]) => (
        <div key={date}>
          <h3>Date: {date}</h3>
          <Paper elevation={6} style={{ width: '50%', display: 'flex' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Model Name</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{customer.model_name}</TableCell>
                    <TableCell align="center">{customer.quantity}</TableCell>
                    <TableCell align="center">{customer.amount}</TableCell>
                    <TableCell align="center">{customer.total_amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      ))}
      
    </div>
  );
};

export default HandleCustomerCard;
