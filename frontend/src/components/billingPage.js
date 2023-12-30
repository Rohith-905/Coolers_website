// BillingPage.js
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './billPage.css';

const BillingPage = () => {

  // Access location to get state
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  // Destructure data from state
  const { formData, additionalDetailsList, dueAmount } = state;

  const [paidAmount, setPaidAmount] = useState(0);
  const [invoiceNumber,setInvoiceNumber] = useState('');
  const [overallTotalAmount,setOverallTotalAmount ] = useState(0);
  let remainingAmount = 0;

  const handlePaidAmountChange = (event) => {
    setPaidAmount(event.target.value);
  };

  // const handleDueAmountChange = (event) => {
  //   setDueAmount(event.target.value);
  // };

  // Calculate total amount based on additional details
  const calculateTotalAmount = () => {
    setOverallTotalAmount((additionalDetailsList.reduce((total, detail) => total + detail.amount * detail.quantity, 0)) + dueAmount);
  };

  const generatePDF = async() => {
    const element = document.querySelector('.BillStyle');

    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.html(element, {
      html2canvas: {
        scale: 0.8, // Adjust scale if needed
      },
      x: 10,
      y: 10,
      callback: function (pdf) {
        const filename = `invoice_${invoiceNumber}.pdf`;
        savePDFLocally(pdf.output('blob'), filename);
      }
    });
  };
  

  const handlePrint = () => {
    // generatePDF(); // Generate PDF before printing
    console.log("overallTotalAmount",overallTotalAmount,paidAmount);
    remainingAmount = overallTotalAmount-paidAmount;
    savePDFToBackend();
    updateRemainingAmount();
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

  const savePDFToBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/saveFormDataAndDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({invoiceNumber, formData, additionalDetailsList, paidAmount, overallTotalAmount, dueAmount }),
      });

      if (response.ok) {
        console.log('Data saved to the backend');
        // Optionally, perform further actions after successful save
      } else {
        console.error('Failed to save data to the backend');
      }
    } catch (error) {
      console.error('Error saving data to the backend:', error);
    }
  };

  const updateRemainingAmount = async () =>{
    try{
      console.log(remainingAmount,formData.customer_name);
      const response = await fetch('http://localhost:5000/api/updateDueAmount',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"remainingAmount":remainingAmount,"name":formData.model_name}),
      });
      if (response.ok) {
        console.log('Data saved to the backend');
        // Optionally, perform further actions after successful save
      } else {
        console.error('Failed to save data to the backend');
      }
    } catch (error) {
      console.error('Error saving data to the backend:', error);
    }
  }


  // Generate a unique invoice number based on date/time and a random number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    setInvoiceNumber(`INV-${formattedDate}-${randomDigits}`);
  };

  useEffect(() => {
    generateInvoiceNumber();
    calculateTotalAmount();
}, []);


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
      <div className="header">
        <div className="left-info">
          <p><strong>GSTNo:</strong> Uncle GST no</p>
        </div>
        <div className="right-info">
          <p><strong>Date:</strong> {formData.date}</p>
        </div>
      </div>
  
      <h2>XYZ Name</h2>
      <pre>Address: H.NO : 15, 13-261, Bypass Rd, near NTR STATUE,
           Bank Colony, Khammam, Telangana 507002</pre>
      <p><strong>Ph No:</strong>+1 (234) 567-890</p>
    </div>
  
    <h2>Billing Details</h2>
  
    <div className="header">
      <div className="left-info">
          <p><strong>Name:</strong> {formData.customer_name}</p>
          <p><strong>Invoice No:</strong> {invoiceNumber}</p>
          <p><strong>Shop Address:</strong> {formData.shop_address}</p>
          <p><strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
      </div>
    </div>
  
    <h3>Purchase Details</h3>
    <table>
      <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Model Name</th>
            <th>Amount</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
      <tbody>
          {additionalDetailsList.map((detail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{detail.model_name}</td>
              <td>{detail.amount}</td>
              <td>{detail.quantity}</td>
              <td>{detail.amount * detail.quantity}</td>
            </tr>
          ))}
          {
            dueAmount?
            <tr className="totalAmountRow">
              <td colSpan="3"></td>
              <td><strong>Due Amount:</strong></td>
              <td>{dueAmount}</td>
            </tr>
            :null
          }
          
          <tr className="totalAmountRow">
            <td colSpan="3"></td>
            <td><strong>Total Amount:</strong></td>
            <td>{overallTotalAmount}</td>
          </tr>
        </tbody>
    </table>
  
    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '100px'}}>
        <label>Amount Paid:</label>
        <input
          id="paidAmount"
          type="text"
          value={paidAmount}
          onChange={handlePaidAmountChange}
          required
        />
        <label>Remaining Due:</label>
        <input
          id="remainingDue"
          type="text"
          value={overallTotalAmount-paidAmount}
          readOnly
          required
        />
    </div>
    <h2 className='thankYouMessage'>Thank you, visit again!</h2>
  <Button className='printButton' onClick={handlePrint}>
      Print
    </Button>
  </div>
  
      
    );
  //   <div className='BillStyle'>
  //   <Button className='BackButton' onClick={redirectToAddCustomers}>
  //       Back
  //     </Button>
  //     <div className="shopDetails">
  //         <h2>Rohit Coolers</h2>
  //         <p>Address: H.NO : 15, 13-261, Bypass Rd, near NTR STATUE, Bank Colony, Khammam, Telangana 507002</p>
  //     </div>
  //     <h2 >Billing Details</h2>
  //     <div className="header">
  //   <div className="left-info">
  //     <p><strong>Invoice No:</strong> {invoiceNumber}</p>
  //     <p><strong>GSTNo:</strong> Uncle GST no</p>
  //   </div>
  //   <div className="right-info">
  //     <p><strong>Customer Name:</strong> {formData.customer_name}</p>
  //     <p><strong>Shop Address:</strong> {formData.shop_address}</p>
  //     <p><strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
  //     <p><strong>Date:</strong> {formData.date}</p>
  //   </div>
  // </div>

  //     <h3 >Purchase Details</h3>
  //     <table >
  //       <thead>
  //         <tr>
  //           <th>Model Name</th>
  //           <th>Amount</th>
  //           <th>Quantity</th>
  //           <th>Total</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {additionalDetailsList.map((detail, index) => (
  //           <tr key={index}>
  //             <td>{detail.model_name}</td>
  //             <td>{detail.amount}</td>
  //             <td>{detail.quantity}</td>
  //             <td>{detail.amount *detail.quantity}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     <p className="totalAmount">Total Amount:<span className="totalValue">{calculateTotalAmount()}</span></p>

  //     {/* New input fields for Paid and Due amounts */}
  //     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '100px' }}>
  //       <label> Amount Paid:</label>
  //       <input
  //         id="paidAmount"
  //         type="text"
  //         value={paidAmount}
  //         onChange={handlePaidAmountChange}
  //         required
  //       />
  //       <label>Remaining Due:</label>
  //       <input
  //         id="remainingDue"
  //         type="text"
  //         value={calculateTotalAmount()-paidAmount}
  //         readOnly
  //         required
  //       />
  //     </div>

  //     <Button className='printButton' onClick={handlePrint}>
  //       Print
  //     </Button>
  //   </div>
  // );
};


export default BillingPage;
