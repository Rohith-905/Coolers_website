import React,{useRef} from 'react';
import './billPage.css';
import { Button, Grid } from '@mui/material';
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

const InvoiceDetailsByNumber = ( {selectedCustomer, details,invoiceNumber,setSelectedCustomer} ) => {
    // console.log(selectedCustomer, details, invoiceNumber);

    const billingDivRef = useRef(null);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatAmountWithCommas = (amount) => {
        // Use toLocaleString to format amount with commas
        return amount.toLocaleString('en-IN');
      };

    // if(selectedCustomer){
    //     setTimeout(() => {
    //         window.print();
    //         setSelectedCustomer(false);
    //       }, 1000);  
    // }

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
        window.print();
      };

      const handleBack = () =>{
        setSelectedCustomer(false);
      }
    return (
            <div>
                {
                    selectedCustomer?
                    <Button className='printButton' sx={{
                        backgroundColor: '#1a75ff',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#0066ff',
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        },
                       
                      }}onClick={handleBack}>
                        Back
                    </Button>:null
                }
                
                {/* {errorMessage && <p>{errorMessage}</p>} */}
                <div ref={billingDivRef} className='BillStyle'>
                    {details && (
                        <><div className="shopDetails">
                            <div className="header">
                                <div className="left-info">
                                    <p><strong>GSTNo:</strong> 36AIMPT0183B2Z9</p>
                                </div>
                                <div className="right-info">
                                    <p><strong>Date:</strong>{formatDate(details.date)}</p>
                                </div>
                            </div>
                        </div>
                        {/* <Grid display={'flex'} justifyContent={'space-between'}>
                            <Grid item xs={12} md={6} >
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
                                <p><strong>Name:</strong> {details.customer_name}<br/>
                                <strong>Invoice No:</strong> {invoiceNumber}<br/>
                                <strong>Shop Address:</strong> {details.shop_address}<br/>
                                <strong>Vehicle Number:</strong> {details.vehicle_number}</p>
                                </Grid>
                            </Grid>
                        </Grid> */}
                        <table>
                            <tr>
                                <td style={{width: '50%',textAlign: 'left'}}>
                                    <strong>SAI ROHIT ELECTRONICS & HOME NEEDS</strong><br />
                                    <strong>Address:</strong>D.NO: 2-5-52, PSR Road,<br />
                                    Khammam-507003, Telangana,<br />
                                    <strong>Ph No:</strong>9849377387,8465077387
                                </td>
                                <td style={{width: '50%',textAlign: 'left'}}>
                                    <strong>Name:</strong> {details.customer_name}<br />
                                    <strong>Invoice No:</strong> {invoiceNumber}<br />
                                    <strong>Shop Address:</strong> {details.shop_address}<br />
                                    <strong>Vehicle Number:</strong> {details.vehicle_number}
                                </td>
                            </tr>
                            </table>

                        <div>
                                {/* {details.map((detail, index) => ( */}
                                    <div>
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
                                                {JSON.parse(details.additional_details_json).map((details, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{details.model_name}</td>
                                                        <td>{formatAmountWithCommas(details.amount)}</td>
                                                        <td>{details.quantity}</td>
                                                        <td>{formatAmountWithCommas(details.amount * details.quantity)}</td>
                                                    </tr>
                                                ))}
                                                <tr className="totalAmountRow">
                                                    <td colSpan="3"></td>
                                                    <td><strong>Total Amount:</strong></td>
                                                    <td>{formatAmountWithCommas(details.overallTotalAmount-details.dueAmount)}</td>
                                                </tr>
                                                {
                                                    details.dueAmount?
                                                    <tr className="totalAmountRow">
                                                    <td colSpan="3"></td>
                                                    <td><strong>Due Amount:</strong></td>
                                                    <td>{formatAmountWithCommas(details.dueAmount)}</td>
                                                    </tr>
                                                    :null
                                                }
                                                <tr className="totalAmountRow">
                                                    <td colSpan="3"></td>
                                                    <td><strong>Grand Total Amount:</strong></td>
                                                    <td>{formatAmountWithCommas(details.overallTotalAmount)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '100px' }}>
                                            <label  style={{fontSize:'1.2em'}}><strong>Amount Paid:</strong></label>
                                            <input
                                                id="paidAmount"
                                                type="text"
                                                value={formatAmountWithCommas(details.paidAmount)}
                                                readOnly
                                                required
                                                style={{ outline: 'none' }}
                                            />
                                            <label  style={{fontSize:'1.2em'}}><strong>Remaining Due:</strong></label>
                                            <input
                                                id="remainingDue"
                                                type="text"
                                                value={formatAmountWithCommas(details.overallTotalAmount - details.paidAmount)}
                                                readOnly
                                                required
                                                style={{ outline: 'none',fontWeight:'bold' }}
                                            />
                                        </div>
                                        <h2 className='thankYouMessage'>Thank you, visit again!</h2>
                                
                                    </div>
                                {/* ))} */}
                            </div></>
                    )}
                </div>

                {selectedCustomer  && (
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                    >
                    <div>
                        <Button 
                            sx={{
                                backgroundColor: '#1a75ff',
                                color: '#fff',
                                '&:hover': {
                                backgroundColor: '#0066ff',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                },
                            
                            }}onClick={handlePrint}  className="printButton">
                            Print Invoice
                        </Button>
                    </div>
                    <div style={{paddingLeft:'100px'}}>

                        <Button sx={{
                            backgroundColor: '#1a75ff',
                            color: '#fff',
                            '&:hover': {
                            backgroundColor: '#0066ff',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            },
                        
                            }}onClick={handlePdf} className="printButton">
                            Download Invoice
                        </Button>
                    </div>
                </div>
                )}
            </div>
    );

}
export default InvoiceDetailsByNumber;