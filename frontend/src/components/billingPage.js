// BillingPage.js
import React, {useRef, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
// import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';
import './billPage.css';
import { Dialog, DialogActions, DialogTitle, Grid } from '@mui/material';

const BillingPage = ({formData, additionalDetailsList, dueAmount, purchased, setPrint, handleReset, fetchCustomerNames}) => {

  // // Access location to get state
  // const location = useLocation();
  // const { state } = location;
  // const navigate = useNavigate();

  // Destructure data from state
  // const { formData, additionalDetailsList, dueAmount, purchased } = state;

  const [paidAmount, setPaidAmount] = useState(0);
  const [invoiceNumber,setInvoiceNumber] = useState('');
  const [overallTotalAmount,setOverallTotalAmount ] = useState(0);
  let remainingAmount = 0;
  const [open,setOpen] = useState(false);
  const billingDivRef = useRef(null);

  const handlePaidAmountChange = (event) => {
    setPaidAmount(event.target.value);
  };

  // const handleDueAmountChange = (event) => {
  //   setDueAmount(event.target.value);
  // };

  // Calculate total amount based on additional details
  const calculateTotalAmount = () => {
    setOverallTotalAmount((additionalDetailsList.reduce((total, detail) => total + detail.amount * detail.quantity, 0)));
  };

  // const generatePDF = async() => {
  //   const element = document.querySelector('.BillStyle');

  //   const pdf = new jsPDF('p', 'pt', 'a4');
  //   pdf.html(element, {
  //     html2canvas: {
  //       scale: 0.8, // Adjust scale if needed
  //     },
  //     x: 10,
  //     y: 10,
  //     callback: function (pdf) {
  //       const filename = `invoice_${invoiceNumber}.pdf`;
  //       savePDFLocally(pdf.output('blob'), filename);
  //     }
  //   });
  // };
  const handlePdf = () => {
    if (billingDivRef.current) {
      html2canvas(billingDivRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Adjust the quality as needed
        const pdf = new jsPDF("p", "mm", "a4");

        // Calculate dimensions to maintain aspect ratio
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(`invoice_${invoiceNumber}.pdf`);
      });
    }
  };

  const handlePrint = () => {
    setOpen(false);
    handlePdf();
    // generatePDF(); // Generate PDF before printing
    // console.log("overallTotalAmount",overallTotalAmount,paidAmount);
    remainingAmount = overallTotalAmount-paidAmount;
    savePDFToBackend();
  };

  // const savePDFLocally = (pdfBlob, filename) => {
  //   const blobUrl = URL.createObjectURL(pdfBlob);
  //   const link = document.createElement('a');
  //   link.href = blobUrl;
  //   link.download = filename;
  //   link.click();
  //   URL.revokeObjectURL(blobUrl);
  // };

  const savePDFToBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/saveFormDataAndDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({invoiceNumber, formData, additionalDetailsList, paidAmount, overallTotalAmount, dueAmount, purchased }),
      });

      if (response.ok) {
        console.log('Data saved to the backend');
        updateRemainingAmount();
        window.print(); // Print the document
        handleReset();
        setPrint(false);
        fetchCustomerNames();
        // Optionally, perform further actions after successful save
      } else {
        window.alert('Failed to save data to the backend');
      }
    } catch (error) {
      window.alert('Error saving data to the backend:', error);
    }
  };

  const updateRemainingAmount = async () =>{
    try{
      // console.log(remainingAmount,formData.customer_name);
      const response = await fetch('http://localhost:5000/api/updateDueAmount',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"remainingAmount":remainingAmount,"name":formData.customer_name,"purchased":purchased}),
      });
      if (response.ok) {
        console.log('Data saved to the backend');
        // Optionally, perform further actions after successful save
      } else {
        window.alert('Failed updating Remaining amount to backend');
      }
    } catch (error) {
      window.alert('Error updating Remaining amount to backend:', error);
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
    // console.log(purchased);
}, []);


   // Redirect to AddCustomers component
   const redirectToAddCustomers = () => {
    // navigate('/addCustomers');
    setPrint(false);
  };

  const handleClose = () =>{
     setOpen(false);
  }

  const handleOpen =()=>{
    setOpen(true);
  }

  const formatAmountWithCommas = (amount) => {
    // Use toLocaleString to format amount with commas
    return amount.toLocaleString('en-IN');
  };

  return (
    <div className='BillStyle'>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Do you want to print?</DialogTitle>
        <DialogActions>
          <Button onClick={handlePrint}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
      
      <Button className='BackButton' onClick={redirectToAddCustomers}>
        Back
      </Button>
      <div ref={billingDivRef} style={{padding:'20px'}}>
        <div  className="shopDetails">
          <div className="header">
            <div className="left-info">
              <p><strong>GSTNo:</strong> 36AIMPT0183B2Z9</p>
            </div>
            <div className="right-info">
              <p><strong>Date:</strong> {formData.date}</p>
            </div>
          </div>
        </div>
        {/* <Grid display={'flex'} justifyContent={'space-between'}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} style={{ paddingLeft: '10px' }}>
              <p>
              <strong>SAI ROHIT ELECTRONICS & HOME NEEDS</strong><br/>
              <strong>Address:</strong>D.NO: 2-5-52, PSR Road,<br/>
                Khammam-507003,Telangana,<br/>
                <strong>Ph No:</strong>9849377387,8465077387
              </p>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} style={{ paddingLeft: '50px' }}>
              <p><strong>Name:</strong> {formData.customer_name}<br/>
              <strong>Invoice No:</strong> {invoiceNumber}<br/>
              <strong>Shop Address:</strong> {formData.shop_address}<br/>
              <strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
            </Grid>
          </Grid>
        </Grid> */}
        <table>
          <tr >
            <td style={{width: '50%',textAlign: 'left'}}>
              <strong>SAI ROHIT ELECTRONICS & HOME NEEDS</strong><br />
              <strong>Address:</strong>D.NO: 2-5-52, PSR Road,<br />
              Khammam-507003, Telangana,<br />
              <strong>Ph No:</strong>9849377387,8465077387
            </td>
            <td style={{width: '50%',textAlign: 'left'}}>
              <strong>Name:</strong> {formData.customer_name}<br />
              <strong>Invoice No:</strong> {invoiceNumber}<br />
              <strong>Shop Address:</strong> {formData.shop_address}<br />
              <strong>Vehicle Number:</strong> {formData.vehicle_number}
            </td>
          </tr>
        </table>

        <h2>Billing Details</h2>
      
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
                  <td>{formatAmountWithCommas(detail.amount)}</td>
                  <td>{detail.quantity}</td>
                  <td>{formatAmountWithCommas(detail.amount * detail.quantity)}</td>
                </tr>
              ))}
              <tr className="totalAmountRow">
                <td colSpan="3"></td>
                <td><strong>Total Amount:</strong></td>
                <td>{formatAmountWithCommas(overallTotalAmount)}</td>
              </tr>
              {
                dueAmount?
                <tr className="totalAmountRow">
                  <td colSpan="3"></td>
                  <td><strong>Due Amount:</strong></td>
                  <td>{formatAmountWithCommas(dueAmount)}</td>
                </tr>
                :null
              }
              
              <tr className="totalAmountRow">
                <td colSpan="3"></td>
                <td><strong>Grand Total Amount:</strong></td>
                <td>{formatAmountWithCommas(overallTotalAmount+dueAmount)}</td>
              </tr>
            </tbody>
        </table>
      

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '100px'}}>
            <label style={{fontSize:'1.2em'}}><strong>Amount Paid:</strong></label>

            <input
              id="paidAmount"
              type="text"
              value={formatAmountWithCommas(paidAmount)}
              onChange={handlePaidAmountChange}
              style={{width:'100px', height:'40px'}}
              required
            />
            <label style={{fontSize:'1.2em'}}>Remaining Due:</label>
            <input
              id="remainingDue"
              type="text"
              value={formatAmountWithCommas(overallTotalAmount-paidAmount)}
              readOnly
              style={{width:'100px', height:'40px'}}
              required
            />
        </div>
        <h2 className='thankYouMessage'>Thank you, visit again!</h2>
      </div>
      <Button className='printButton' onClick={handleOpen}>
        Print
      </Button>
    </div>
    <Grid display={'flex'}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2} style={{ paddingLeft: '10px' }}>
          <p>
          <strong>SAI ROHIT ELECTRONICS & HOME NEEDS</strong><br/>
          <strong>Address:</strong>D.NO: 2-5-52, PSR Road,<br/>
            Khammam-507003,Telangana,<br/>
            <strong>Ph No:</strong>9849377387,8465077387
          </p>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2} style={{ paddingLeft: '50px' }}>
          <p><strong>Name:</strong> {formData.customer_name}<br/>
          <strong>Invoice No:</strong> {invoiceNumber}<br/>
          <strong>Shop Address:</strong> {formData.shop_address}<br/>
          <strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
        </Grid>
      </Grid>
    </Grid>
    <h2>Billing Details</h2>
  
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
              <td>{formatAmountWithCommas(detail.amount)}</td>
              <td>{detail.quantity}</td>
              <td>{formatAmountWithCommas(detail.amount * detail.quantity)}</td>
            </tr>
          ))}
          {
            dueAmount?
            <tr className="totalAmountRow">
              <td colSpan="3"></td>
              <td><strong>Due Amount:</strong></td>
              <td>{formatAmountWithCommas(dueAmount)}</td>
            </tr>
            :null
          }
          
          <tr className="totalAmountRow">
            <td colSpan="3"></td>
            <td><strong>Total Amount:</strong></td>
            <td>{formatAmountWithCommas(overallTotalAmount)}</td>
          </tr>
        </tbody>
    </table>
  
    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '100px'}}>
        <label style={{fontSize:'1.2em'}}>Amount Paid:</label>
        <input
          id="paidAmount"
          type="text"
          value={formatAmountWithCommas(paidAmount)}
          onChange={handlePaidAmountChange}
          style={{width:'100px', height:'40px'}}
          required
        />
        <label style={{fontSize:'1.2em'}}>Remaining Due:</label>
        <input
          id="remainingDue"
          type="text"
          value={formatAmountWithCommas(overallTotalAmount-paidAmount)}
          readOnly
          style={{width:'100px', height:'40px'}}
          required
        />
    </div>
    <h2 className='thankYouMessage'>Thank you, visit again!</h2>
    <Button className='printButton' onClick={handleOpen}>
      Print
    </Button>
  </div>
      
    )
};


export default BillingPage;
