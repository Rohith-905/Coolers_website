// frontend/src/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AppBarPage from './appBarPage';

const Home = () => {
  const [coolers, setCoolers] = useState([]);
  const [error, setError] = useState(' ');
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
    const fetchCoolers = async () => {
      try {
        // Fetch data from your API endpoint
        axios.get('http://localhost:5000/api/coolers_available')
          .then(response => {
            setCoolers(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } catch (err) {
        setError('No Coolers Available');
      }
    };

    fetchCoolers();
  }, []);


  const handleSearch = (e) => {
		const inputValue = e.target.value.toLowerCase();
	
		// Update search input value as the user types
		setSearchInput(inputValue);
	
		// If the search input is empty, reset customer details to the original list
		if (inputValue === '') {
			const fetchCoolers = async () => {
				try {
					const response = await axios.get('http://localhost:5000/api/coolers_available');
					setCoolers(response.data);
				} catch (error) {
					console.error('Error fetching data:', error);
					setError('Error fetching data');
				}
			};
	
			fetchCoolers();
		} else {
			// Filter coolers based on the search input
			const filteredCoolers = coolers.filter(cooler =>
				cooler.model_name.toLowerCase().includes(inputValue)
			);
			setCoolers(filteredCoolers);
		}
	};

  return (
    <div>
      <AppBarPage>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <h2>Available Coolers</h2>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div style={{ marginBottom: '10px' }}>
                  <TextField
                    id="standard-basic"
                    label="Search by Cooler Name"
                    variant="standard"
                    value={searchInput}
                    onChange={handleSearch}
                  />
                </div>
                </Grid>
              <Grid item xs={8}/>
            </Grid>
            {coolers.length > 0 ? (
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Name</StyledTableCell>
                      <StyledTableCell align="center">Quantity Available</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coolers.map((cooler) => (
                      <StyledTableRow key={cooler.id}>
                        <StyledTableCell align="center">{cooler.model_name}</StyledTableCell>
                        <StyledTableCell align="center">{cooler.quantity}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No coolers available</p>
            )}

            {error && <p>{error}</p>}
          </Grid>
        </Grid>
      </div>
      </AppBarPage>
    </div>
  );
};

export default Home;
