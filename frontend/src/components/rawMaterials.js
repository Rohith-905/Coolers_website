import axios from "axios";
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {Grid, Table, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AppBarPage from "./appBarPage";


const RawMaterials = () => {

    const [customerDetails, setCustomerDetails] = useState([]);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [originalCustomerDetails, setOriginalCustomerDetails] = useState([]);

  
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

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        
      }));

      useEffect(() => {
        const fetchCustomerDetails = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/rawmaterialDetails');
            setCustomerDetails(response.data);
            setOriginalCustomerDetails(response.data); // Store original data
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
      
        if (inputValue === '') {
          // Reset customer details to the original list
          setCustomerDetails(originalCustomerDetails); // Restore original data
        } else {
          // Filter based on the search input using the original data
          const filteredCustomers = originalCustomerDetails.filter(customer =>
            customer.Material_Name.toLowerCase().includes(inputValue)
          );
          setCustomerDetails(filteredCustomers);
        }
      };

      return (
		
        <AppBarPage >
            <h2>RawMaterial Details</h2>
            <Grid container spacing={2}>
					<Grid item xs={4}>
					<div style={{ marginBottom: '10px' }}>
						<TextField
							id="standard-basic"
							label="Search by Material Name"
							variant="standard"
							value={searchInput}
							onChange={handleSearch}
						/>
					</div>
					</Grid>
					<Grid item xs={8}/>
				</Grid>
        {customerDetails.length > 0 ? (
            <div className="CustomerDetails">
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Material Name</StyledTableCell>
                        <StyledTableCell align="center">Quantity</StyledTableCell>
                        </TableRow>
					</TableHead>
				    <TableBody>
                    {customerDetails.map((customer) => (
									<StyledTableRow key={customer.id}>
										<StyledTableCell align="center">{customer.Material_Name}</StyledTableCell>
                                        <StyledTableCell align="center">{customer.quantity}</StyledTableCell>
                                        </StyledTableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<p>No RawMaterial available</p>
				)}
				{error && <p>{error}</p>}
			</AppBarPage>
  );
};
export default RawMaterials;

