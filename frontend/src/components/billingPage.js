// BillingPage.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BillingPage = () => {

      // Access location to get state
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  // Destructure data from state
  const { formData, additionalDetails } = state;

  // Calculate total amount based on additional details
  const calculateTotalAmount = () => {
    return additionalDetails.reduce((total, detail) => total + detail.amount * detail.quantity, 0);
  };

  // Generate a unique invoice number based on date/time and a random number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `INV-${formattedDate}-${randomDigits}`;
  };

  const handlePrint = () => {
    // Implement print functionality here
    window.print();
  };

   // Redirect to AddCustomers component
   const redirectToAddCustomers = () => {
    navigate('/addCustomers');
  };

  return (
    <div style={styles.container}>
    <Button variant="contained" color="primary" onClick={redirectToAddCustomers} style={styles.printButton}>
        Back
      </Button>
      <h2 style={styles.heading}>Billing Details</h2>
      <div style={styles.customerInfo}>
        <p><strong>Invoice No:</strong>{generateInvoiceNumber()}</p>
        <p><strong>Customer Name:</strong> {formData.customer_name}</p>
        <p><strong>Shop Address:</strong> {formData.shop_address}</p>
        <p><strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
        <p><strong>Date:</strong> {formData.date}</p>
        <p><strong>GSTNo</strong> Uncle GST no</p>
      </div>

      <h3 style={styles.subHeading}>Additional Details</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Amount</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {additionalDetails.map((detail, index) => (
            <tr key={index}>
              <td>{detail.model_name}</td>
              <td>{detail.amount}</td>
              <td>{detail.quantity}</td>
              <td>{detail.amount *detail.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={styles.totalAmount}>Total Amount: {calculateTotalAmount()}</p>

      <Button variant="contained" color="primary" onClick={handlePrint} style={styles.printButton}>
        Print
      </Button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '20px',
    marginTop: '30px',
    marginBottom: '10px',
  },
  customerInfo: {
    marginBottom: '30px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  totalAmount: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  printButton: {
    marginTop: '20px',
  },
};

export default BillingPage;
