import axios from "axios";
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AppBarPage from "./appBarPage";

const Customers = () => {

  const [customerDetails, setCustomerDetails] = useState([]);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customerDetails');
        setCustomerDetails(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchCustomerDetails();
  }, []);

  const handleSearch = (e) => {
		const inputValue = e.target.value.toLowerCase();
	
		// Update search input value as the user types
		setSearchInput(inputValue);
	
		// If the search input is empty, reset customer details to the original list
		if (inputValue === '') {
			const fetchCustomerDetails = async () => {
				try {
					const response = await axios.get('http://localhost:5000/api/customerDetails');
					setCustomerDetails(response.data);
				} catch (error) {
					console.error('Error fetching data:', error);
					setError('Error fetching data');
				}
			};
	
			fetchCustomerDetails();
		} else {
			// Filter customerDetails based on the search input
			const filteredCustomers = customerDetails.filter(customer =>
				customer.customer_name.toLowerCase().includes(inputValue)
			);
			setCustomerDetails(filteredCustomers);
		}
	};


  return (
		
    <div>
			<AppBarPage >
				<h2>Customer Details</h2>
				<Grid container spacing={2}>
					<Grid item xs={4}>
					<div style={{ marginBottom: '10px' }}>
						<TextField
							id="standard-basic"
							label="Search by Customer Name"
							variant="standard"
							value={searchInput}
							onChange={handleSearch}
						/>
					</div>
					</Grid>
					<Grid item xs={8}/>
				</Grid>

				{customerDetails.length > 0 ? (
					<div>
						<Table>
							<TableHead>
								<TableRow>
									<StyledTableCell align="center">Customer Name</StyledTableCell>
									<StyledTableCell align="center">Address</StyledTableCell>
									<StyledTableCell align="center">Model Name</StyledTableCell>
									<StyledTableCell align="center">Amount</StyledTableCell>
									<StyledTableCell align="center">Quantity</StyledTableCell>
									<StyledTableCell align="center">VehicleNo</StyledTableCell>
									<StyledTableCell align="center">Date</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{customerDetails.map((customer) => (
									<StyledTableRow key={customer.id}>
										<StyledTableCell align="center">{customer.customer_name}</StyledTableCell>
										<StyledTableCell align="center">{customer.shop_address}</StyledTableCell>
										<StyledTableCell align="center">{customer.model_name}</StyledTableCell>
										<StyledTableCell align="center">{customer.amount}</StyledTableCell>
										<StyledTableCell align="center">{customer.quantity}</StyledTableCell>
										<StyledTableCell align="center">{customer.vehicle_number}</StyledTableCell>
										<StyledTableCell align="center">{customer.date}</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<p>No Customers available</p>
				)}
				{error && <p>{error}</p>}
			</AppBarPage>
    </div>
  );
};
export default Customers;
