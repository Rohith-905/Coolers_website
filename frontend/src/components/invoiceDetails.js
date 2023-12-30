import React, { useState } from 'react';
import Button from '@mui/material/Button';
import AppBarPage from './appBarPage';
import './billPage.css';

const InvoiceDetailsByNumber = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [details, setDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (event) => {
        setInvoiceNumber(event.target.value);
    };

    const getDetailsByInvoice = async () => {
        try {

            const response = await fetch(`http://localhost:5000/api/getDetailsByInvoiceNumber?invoiceNumber=${invoiceNumber}`);
            if (response.ok) {
                const data = await response.json();
                setDetails(data);
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                setDetails(null);
                setErrorMessage(errorData.message || 'Failed to fetch details');
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            setDetails(null);
            setErrorMessage('Failed to fetch details');
        }
    };

    return (
        <AppBarPage>
            <div>
                <input
                    type="text"
                    value={invoiceNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Invoice Number"
                />
                <Button onClick={getDetailsByInvoice}>Get Details</Button>

                {errorMessage && <p>{errorMessage}</p>}
                <div className='BillStyle'>
                    {details && (
                        <><div className="shopDetails">
                            <div className="header">
                                <div className="left-info">
                                    <p><strong>GSTNo:</strong> Uncle GST no</p>
                                </div>
                                <div className="right-info">
                                    <p><strong>Date:</strong>{formatDate(details[0].date)}</p>
                                </div>
                            </div>

                            <h2>XYZ Name</h2>
                            <pre className="pre-address">
                                Address: H.NO : 15, 13-261, Bypass Rd, near NTR STATUE, Bank Colony, Khammam, Telangana 507002
                            </pre>
                            <p><strong>Ph No:</strong>+1 (234) 567-890</p>
                        </div><div>
                                {details.map((detail, index) => (
                                    <div key={index}>

                                        <h2>Billing Details</h2>

                                        <div className="header">
                                            <div className="left-info">
                                                <p><strong>Name:</strong> {detail.customer_name}</p>
                                                <p><strong>Invoice No:</strong> {invoiceNumber}</p>
                                                <p><strong>Shop Address:</strong> {detail.shop_address}</p>
                                                <p><strong>Vehicle Number:</strong> {detail.vehicle_number}</p>
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
                                                {JSON.parse(detail.additional_details_json).map((detail, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{detail.model_name}</td>
                                                        <td>{detail.amount}</td>
                                                        <td>{detail.quantity}</td>
                                                        <td>{detail.amount * detail.quantity}</td>
                                                    </tr>
                                                ))}
                                                <tr className="totalAmountRow">
                                                    <td colSpan="3"></td>
                                                    <td><strong>Total Amount:</strong></td>
                                                    <td>{detail.overallTotalAmount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '100px' }}>
                                            <label>Amount Paid:</label>
                                            <input
                                                id="paidAmount"
                                                type="text"
                                                value={detail.paidAmount}
                                                readOnly
                                                required
                                                style={{ outline: 'none' }}
                                            />
                                            <label>Remaining Due:</label>
                                            <input
                                                id="remainingDue"
                                                type="text"
                                                value={detail.overallTotalAmount - detail.paidAmount}
                                                readOnly
                                                required
                                                style={{ outline: 'none' }}
                                            />
                                        </div>
                                        <h2 className='thankYouMessage'>Thank you, visit again!</h2>
                                
                                    </div>
                                ))}
                            </div></>
                    )}
                </div>
            </div>

        </AppBarPage>
    );

}
export default InvoiceDetailsByNumber;