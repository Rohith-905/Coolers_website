import React from 'react';
import AppBarPage from './appBarPage';
import './billPage.css';

const InvoiceDetailsByNumber = ( {details,invoiceNumber} ) => {
    console.log(invoiceNumber);
    console.log(details);
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

    return (
        <AppBarPage loggedIn={true}>
            <div>
                {/* {errorMessage && <p>{errorMessage}</p>} */}
                <div className='BillStyle'>
                    {details && (
                        <><div className="shopDetails">
                            <div className="header">
                                <div className="left-info">
                                    <p><strong>GSTNo:</strong> Uncle GST no</p>
                                </div>
                                <div className="right-info">
                                    <p><strong>Date:</strong>{formatDate(details.date)}</p>
                                </div>
                            </div>

                            <h2>XYZ Name</h2>
                            <p className="pre-address">
                                Address: H.NO : 15, 13-261, Bypass Rd, near NTR STATUE, Bank Colony, Khammam, Telangana 507002
                            </p>
                            <p><strong>Ph No:</strong>+1 (234) 567-890</p>
                        </div>
                        <div>
                                {/* {details.map((detail, index) => ( */}
                                    <div>

                                        <h2>Billing Details</h2>

                                        <div className="header">
                                            <div className="left-info">
                                                <p><strong>Name:</strong> {details.customer_name}</p>
                                                <p><strong>Invoice No:</strong> {invoiceNumber}</p>
                                                <p><strong>Shop Address:</strong> {details.shop_address}</p>
                                                <p><strong>Vehicle Number:</strong> {details.vehicle_number}</p>
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
                                            <label>Amount Paid:</label>
                                            <input
                                                id="paidAmount"
                                                type="text"
                                                value={formatAmountWithCommas(details.paidAmount)}
                                                readOnly
                                                required
                                                style={{ outline: 'none' }}
                                            />
                                            <label>Remaining Due:</label>
                                            <input
                                                id="remainingDue"
                                                type="text"
                                                value={formatAmountWithCommas(details.overallTotalAmount - details.paidAmount)}
                                                readOnly
                                                required
                                                style={{ outline: 'none' }}
                                            />
                                        </div>
                                        <h2 className='thankYouMessage'>Thank you, visit again!</h2>
                                
                                    </div>
                                {/* ))} */}
                            </div></>
                    )}
                </div>
            </div>

        </AppBarPage>
    );

}
export default InvoiceDetailsByNumber;