// BillingPage.js
import React from 'react';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import '../styles.css';

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

  const generatePDF = () => {
    const element = document.querySelector('.BillStyle');

    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.html(element, {
      html2canvas: {
        scale: 0.8, // Adjust scale if needed
      },
      x: 10,
      y: 10,
      callback: function (pdf) {
        // Save PDF locally
        const invoiceNumber = generateInvoiceNumber(); // Get the invoice number
        const filename = `invoice_${invoiceNumber}.pdf`;
        savePDFLocally(pdf.output('blob'), filename);

        // Send the generated PDF to the backend for storage
        savePDFToDatabase(pdf.output('arraybuffer'),invoiceNumber);
      }
    });
  };

  const savePDFToDatabase = (pdf, invoiceNumber) => {
    fetch('/savePDFToBackend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Change content type to JSON
      },
      body: JSON.stringify({ pdfData: pdf, invoiceNumber: invoiceNumber }), // Include PDF data and invoice number
    })
    .then(response => {
      if (response.ok) {
        console.log('PDF saved to database');
      } else {
        console.error('Failed to save PDF to database');
      }
    })
    .catch(error => {
      console.error('Error saving PDF to database:', error);
    });
  };
  

  const handlePrint = () => {
    generatePDF(); // Generate PDF before printing
    window.print(); // Print the document
  };

  const savePDFLocally = (pdfBlob, filename) => {
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(blobUrl);
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

 

   // Redirect to AddCustomers component
   const redirectToAddCustomers = () => {
    navigate('/addCustomers');
  };

  return (
    <div className='BillStyle'>
    <Button className='BackButton' onClick={redirectToAddCustomers}>
        Back
      </Button>
      <div className="shopDetails">
          <h2>XYZ Name</h2>
          <p>Address: H.NO : 15, 13-261, Bypass Rd, near NTR STATUE, Bank Colony, Khammam, Telangana 507002</p>
      </div>
      <h2 >Billing Details</h2>
      <div className="header">
    <div className="left-info">
      <p><strong>Invoice No:</strong> {generateInvoiceNumber()}</p>
      <p><strong>GSTNo:</strong> Uncle GST no</p>
    </div>
    <div className="right-info">
      <p><strong>Customer Name:</strong> {formData.customer_name}</p>
      <p><strong>Shop Address:</strong> {formData.shop_address}</p>
      <p><strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
      <p><strong>Date:</strong> {formData.date}</p>
    </div>
  </div>

      <h3 >Purchase Details</h3>
      <table >
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

      <p className="totalAmount">Total Amount:<span className="totalValue">{calculateTotalAmount()}</span></p>

      <Button className='printButton' onClick={handlePrint}>
        Print
      </Button>
    </div>
  );
};


export default BillingPage;
