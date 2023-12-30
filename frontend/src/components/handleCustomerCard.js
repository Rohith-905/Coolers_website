// handleCustomerCard.js
import React, { useEffect, useState } from 'react';
import { Button, Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InvoiceDetailsByNumber from './invoiceDetails';
const HandleCustomerCard = ({ customerDetails, onBack }) => {

  const [error,setError] = useState('');
  const [remainingAmount,setRemainingAmount] = useState();
  const remainingAmountColor = remainingAmount < 0 ? 'green' : 'red';
  const advance_or_due = remainingAmount < 0 ? 'Advance' : 'Due';

  let customerName ='';
  // Group customer details by date
  const groupedByDate = {};
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
      const response = await fetch(`http://localhost:5000/api/get_amountDetails?name=${customerName}`);
      if (response.status === 200) {
        const amountDetails = await response.json();
        console.log(amountDetails.remaining);
        setRemainingAmount(amountDetails.remaining);
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
        console.log(remainingAmount);
      } catch (error) {
        console.error('Error fetching amount details:', error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div>
      <Button onClick={onBack}>Back</Button>
      {remainingAmount !== undefined && remainingAmount !== null && (
      <div style={{ textAlign: 'right', color: remainingAmountColor, fontWeight: 'bold' }}>
        {advance_or_due} : {remainingAmount}
      </div>
      )}
      {Object.entries(groupedByDate).map(([date, details]) => (
        <div key={date} style={{width:'70%'}}>
          <h3>Date: {date}</h3>
          {details.map((customer,index) =>(
            <div> 
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{customer.invoice_number}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <InvoiceDetailsByNumber invoiceNumber= {customer.invoice_number} />
                    {/* <Paper elevation={6} style={{ width: '50%', display: 'flex' }}>
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
                      
                          {JSON.parse(customer.additional_details_json).map((model, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{model.model_name}</TableCell>
                              <TableCell align="center">{model.quantity}</TableCell>
                              <TableCell align="center">{model.amount}</TableCell>
                              <TableCell align="center">{model.total_amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper> */}
                  </Typography>
                </AccordionDetails>
              </Accordion>
           </div>
          ))}
          
        </div>
      ))}
      
    </div>
  );
};

export default HandleCustomerCard;
