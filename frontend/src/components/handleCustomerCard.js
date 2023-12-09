// handleCustomerCard.js
import React from 'react';
import { Table, TableBody, TableRow, TableCell, TableHead, Paper, Button } from '@mui/material';

const HandleCustomerCard = ({ customerDetails, onBack }) => {
  // Group customer details by date
  const groupedByDate = {};
  customerDetails.forEach((customer) => {
    const date = customer.date;
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(customer);
  });

  return (
    <div>
      <Button onClick={onBack}>Back</Button>
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
