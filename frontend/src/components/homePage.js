// frontend/src/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AppBarPage from './appBarPage';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import "./addCustomers.css";

const Home = () => {
  const [coolers, setCoolers] = useState([]);
  const [error, setError] = useState(' ');
  const [searchInput, setSearchInput] = useState('');
  const [addCoolers, setAddCoolers] = useState({name:'',quantity:''});
  const [enableAddCoolers,setEnableAddCoolers] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddCoolers((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleAddCoolerButton = () =>{
    setEnableAddCoolers(true);
  }
  const handleAddCoolers = async (e) => {
    e.preventDefault();

    setAddCoolers({
      name:addCoolers.name,
      quantity:addCoolers.quantity
    });
    
    try {
      const response = await axios.post('http://localhost:5000/api/add_coolers', {
        name: addCoolers.name,
        quantity: addCoolers.quantity,
      });
      if (response.status === 201) {
        // Assuming that the response.data contains updated coolers
        setCoolers(response.data);
        // Reset the form
        setAddCoolers({ name: '', quantity: '' });
        // Disable the add coolers section
        setEnableAddCoolers(false);
  
      } else {
        console.error('Failed to add coolers:', response.statusText);
        setError('Failed to add coolers');
      }
    } catch (error) {
      console.error('Error adding coolers:', error);
      setError('Error adding coolers');
    }
  }

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
      <AppBarPage>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <h2>Available Coolers</h2>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Search by Cooler Name"
                    variant="standard"
                    value={searchInput}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: <SearchRoundedIcon />,
                    }}
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
          </Grid>
          <Grid item xs={12} md={6} container justifyContent="flex-end">
            <Grid item xs={9}/>
            <Grid item xs={3}>
              <Button sx={{ backgroundColor: '#1a75ff',color: '#fff',
                '&:hover': {
                  backgroundColor: '#0066ff', // Keep the same color on hover
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
                },}} onClick={handleAddCoolerButton}>Add Coolers</Button>
            </Grid>
            {
              enableAddCoolers ?
              <>
                <form onSubmit={handleAddCoolers}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <label>Cooler Name:</label>
                          <input
                            type="text"
                            name="name"
                            value={addCoolers.name}
                            onChange={handleInputChange}
                            required
                          />
                        </td>
                        <td style={{paddingLeft: '100px' }} >
                          <label>Quantity:</label>
                          <input
                            type="text"
                            name="quantity"
                            value={addCoolers.quantity}
                            onChange={handleInputChange}
                            required
                          />
                        </td>
                      </tr>
                      </tbody>
                  </table>
                  {/* Submit Button */}
                  <Button sx={{ backgroundColor: '#1a75ff',color: '#fff',
                '&:hover': {
                  backgroundColor: '#0066ff', // Keep the same color on hover
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
                },}} type="submit" onClick={handleAddCoolers}>Submit</Button>
                </form>
              </>:null
            }
          </Grid>
        </Grid>
        
      </div>
      </AppBarPage>
  );
};

export default Home;
