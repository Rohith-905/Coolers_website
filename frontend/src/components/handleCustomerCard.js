// handleCustomerCard.js
import React, { useState } from 'react';
import { Table, TableBody, TableRow, TableCell, TableHead, Paper, Button } from '@mui/material';
import CustomerCard from './customerCard';

const HandleCustomerCard = ({ customerDetails }) => {
  const [back, setBack] = useState(false);

  // Group customer details by date
  const groupedByDate = {};
  customerDetails.forEach((customer) => {
    const date = customer.date;
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(customer);
  });

  const handleBack = () => {
    setBack(true);
  };

  // Render customer details grouped by date
  return (
    <div>
      {!back ? (
        <>
        <Button onClick={handleBack}>Back</Button>
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
                  {details.map((customer) => (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">{customer.model_name}</TableCell>
                        <TableCell align="center">{customer.quantity}</TableCell>
                        <TableCell align="center">{customer.amount}</TableCell>
                        <TableCell align="center">{customer.total_amount}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </Paper>
            </div>
          ))}
          
        </>
      ) : (
        <CustomerCard />
      )}
    </div>
  );
};

export default HandleCustomerCard;
