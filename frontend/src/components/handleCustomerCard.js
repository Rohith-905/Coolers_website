// handleCustomerCard.js
import React, { useEffect, useState } from 'react';
import { Button, Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InvoiceDetailsByNumber from './invoiceDetails';
import AppBarPage from './appBarPage';
const HandleCustomerCard = ({ customerDetails, purchased, onBack }) => {

  const [error,setError] = useState('');
  const [remainingAmount,setRemainingAmount] = useState();
  const remainingAmountColor = remainingAmount < 0 ? 'green' : 'red';
  const advance_or_due = remainingAmount < 0 ? 'Advance' : 'Due';
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  let customerName ='';
  // Group customer details by date
  const groupedByDate = {};
  // console.log(customerDetails);
  customerDetails.forEach((customer) => {
    // console.log(customer);
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
      const response = await fetch(`http://localhost:5000/api/get_amountDetails?name=${customerName}&purchased=${purchased}`);
      if (response.status === 200) {
        const amountDetails = await response.json();
        // console.log(amountDetails.amount);
        setRemainingAmount(amountDetails.amount);
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
    const fetchData = async () => {
      try {
        await handleAmountDetails();
        // console.log(remainingAmount);
      } catch (error) {
        console.error('Error fetching amount details:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const formatAmountWithCommas = (amount) => {
    // Use toLocaleString to format amount with commas
    return amount.toLocaleString('en-IN');
  };

  const handlePrint = (customer) => {
    console.log(customer);
    setSelectedCustomer(customer);
    // setTimeout(() => {
    //   window.print();
    // }, 2000);
    
  };

  return (
    <div>
      {selectedCustomer ? (
        <InvoiceDetailsByNumber selectedCustomer={selectedCustomer} details={selectedCustomer} invoiceNumber={selectedCustomer.invoice_number} />)
        :
      <AppBarPage loggedIn={true}>
      <Button onClick={onBack}>Back</Button>
      {remainingAmount !== undefined && remainingAmount !== null && (
      <div style={{ textAlign: 'right', color: remainingAmountColor, fontWeight: 'bold' }}>
        {advance_or_due} : {formatAmountWithCommas(remainingAmount)}
      </div>
      )}
      {Object.entries(groupedByDate).map(([date, details]) => (
        <div key={date}>
          <h3>Date: {date}</h3>
          {details.map((customer) =>(
            <div> 
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{customer.invoice_number}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>
                    <InvoiceDetailsByNumber selectedCustomer={selectedCustomer} details = {customer} invoiceNumber= {customer.invoice_number}/>
                    <Button onClick={() => handlePrint(customer)}>Print</Button>
                  </Typography>
                </AccordionDetails>
              </Accordion>
           </div>
          ))}
          
        </div>
      ))}
      </AppBarPage>
      }
    </div>
  );
};

export default HandleCustomerCard;
