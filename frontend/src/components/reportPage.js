import AppBarPage from "./appBarPage";


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './reportPage.css';

const ReportPage = () => {
  const [data, setData] = useState({ vendorData: [], customerData: [] });
  const [custDue, setCustDue]  = useState(0);
  const [vendorDue, setVendorDue]  = useState(0);
  const custDueColor = custDue < 0 ? 'green' : 'red';
  const vendorDueColor = vendorDue < 0 ? 'green' : 'red';
  const custDueOrAdv = custDue < 0 ? 'Advance' : 'Due';
  const vendorDueOrAdv = vendorDue < 0 ? 'Advance' : 'Due';

  useEffect(() => {
    fetchData();
  }, []);

  const getTotalAmount = (data) => {
    return data
      .filter(row => row.name !== '' && row.amount !== '')
      .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  };

  const formatAmountWithCommas = (amount) => {
    return amount.toLocaleString('en-IN');
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get_due_data');
      setData(response.data);
      console.log(getTotalAmount(response.data.customerData));
      setCustDue(getTotalAmount(response.data.customerData)); // Update custDue
      setVendorDue(getTotalAmount(response.data.vendorData)); // Update vendorDue
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <AppBarPage loggedIn={true}>
      <div className="table-container">
        <div>
          <h2>Vendor</h2>
          <p style={{color : vendorDueColor}}>Total Amount: {vendorDueOrAdv} {formatAmountWithCommas(vendorDue)}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.vendorData
                .filter(row => row.name !== '' && row.amount !== '')
                .map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{formatAmountWithCommas(row.amount)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2>Customer</h2>
          <p style={{color:custDueColor}}>Total Amount: {custDueOrAdv} {formatAmountWithCommas(custDue)}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.customerData
                .filter(row => row.name !== '' && row.amount !== '')
                .map((row, index) => (
                  <tr key={index} style={{ color: row.amount > 0 ? 'red' : 'green' }}>
                    <td>{row.name}</td>
                    <td>{formatAmountWithCommas(row.amount)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppBarPage>
  );
};

export default ReportPage;