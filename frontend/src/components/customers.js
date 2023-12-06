import axios from "axios";
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AppBarPage from "./appBarPage";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';



const Customers = () => {

  const [customerDetails, setCustomerDetails] = useState([]);
  const [error, setError] = useState('');
  const columns = ['Customer Name', 'Model Name', 'Vehicle Number', 'Date']; 
  const [searchInput, setSearchInput] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
	padding: '12px', // Adjust padding as needed
	textAlign: 'center',
	borderBottom: `1px solid ${theme.palette.divider}`, // Add bottom border
	[`&.${tableCellClasses.head}`]: {
	  backgroundColor: theme.palette.primary.main,
	  color: theme.palette.common.white,
	  fontSize: '18px',
	  fontWeight: 'bold',
	},
	[`&.${tableCellClasses.body}`]: {
	  fontSize: '14px',
	},
  }));
  
  // Styling TableRow component
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
	  backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	
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

 
	const handleColumnChange = (event) => {
		setSelectedColumn(event.target.value); // Update the selected column
		setSearchInput(''); // Clear search input when column changes
	  };

	  const handleSearchAll = (e) => {
		const inputValue = e.target.value.toLowerCase();
	
		// Update search input value as the user types
		setSearchInput(inputValue);
	
		if (inputValue === '') {
		  // Reset customer details to the original list if the search input is empty
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
		} else if (selectedColumn !== '') {
		  // Filter customerDetails based on the selected column
		  const filteredCustomers = customerDetails.filter(customer =>
			customer[selectedColumn.toLowerCase()].toLowerCase().includes(inputValue)
		  );
		  setCustomerDetails(filteredCustomers);
		}
	  };


 return (
		
			<AppBarPage >
				<h2>Customer Details</h2>
				<div style={{ marginBottom: '10px' }}>
      			<Select
        			value={selectedColumn}
        			onChange={handleColumnChange}
        			label="Select Column"
					sx={{ minWidth: '200px' }}
      			>
        		<MenuItem value="" disabled></MenuItem>
        		{columns.map((column, index) => (
          		<MenuItem key={index} value={column}>{column}</MenuItem>
        			))}
      			</Select>
				
			
      		<TextField 
        		id="standard-basic"
        		label={`Search by ${selectedColumn}`}
       	 		variant="standard"
        		value={searchInput}
        		onChange={handleSearchAll}
        		disabled={selectedColumn === ''}
				InputProps={{
					startAdornment: <SearchRoundedIcon />,
				  }}
      />
	  </div>
			{customerDetails.length > 0 ? (
					<div className="CustomerDetails">
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
  );
};
export default Customers;
