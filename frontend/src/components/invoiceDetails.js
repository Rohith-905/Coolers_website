import React from 'react';
import './billPage.css';
import { Grid } from '@mui/material';

const InvoiceDetailsByNumber = ( {selectedCustomer, details,invoiceNumber} ) => {
    console.log(selectedCustomer, details, invoiceNumber);

    // const [details, setDetails] = useState(null);
    // const [errorMessage, setErrorMessage] = useState('');

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

    // const getDetailsByInvoice = async () => {
    //     try {
    //         console.log(invoiceNumber);
    //         const response = await fetch(`http://localhost:5000/api/getDetailsByInvoiceNumber?invoiceNumber=${invoiceNumber}`);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setDetails(data);
    //             setErrorMessage('');
    //         } else {
    //             const errorData = await response.json();
    //             setDetails(null);
    //             setErrorMessage(errorData.message || 'Failed to fetch details');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching details:', error);
    //         setDetails(null);
    //         setErrorMessage('Failed to fetch details');
    //     }
    // };

    // useEffect(() =>{
    //     console.log(invoiceNumber);
    //     getDetailsByInvoice();
    // },[]);
    if(selectedCustomer){
        setTimeout(() => {
            window.print();
          }, 2000);
    }

    return (
            <div>
                {/* {errorMessage && <p>{errorMessage}</p>} */}
                <div className='BillStyle'>
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
                                <p><strong>Name:</strong> {details.customer_name}<br/>
                                <strong>Invoice No:</strong> {invoiceNumber}<br/>
                                <strong>Shop Address:</strong> {details.shop_address}<br/>
                                <strong>Vehicle Number:</strong> {details.vehicle_number}</p>
                                </Grid>
                            </Grid>
                            </Grid>
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
                                                    <td><strong>Total Amount:</strong></td>
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
            </div>
    );

}
export default InvoiceDetailsByNumber;