import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, Box, Alert, Autocomplete } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AppBarPage from './appBarPage';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './addCustomers.css';
// import '../styles.css'

const Home = () => {
  const [coolers, setCoolers] = useState([]);
  const [filteredCoolers, setFilteredCoolers] = useState([]);
  const [error, setError] = useState(' ');
  const [searchInput, setSearchInput] = useState('');
  const [addCoolers, setAddCoolers] = useState({ name: '', quantity: '' });
  const [enableAddCoolers, setEnableAddCoolers] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setAddCoolers((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = async (e, name, value) => {  
    setAddCoolers((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      return newData;
    });
  };

  const validateFields = () => {
    const fieldsToValidate = ['name', 'quantity'];
    const isFormValid = fieldsToValidate.every((field) => addCoolers[field]);

    if (!isFormValid) {
      alert('Please fill in all fields before submitting.');
      return false;
    }
    return true;
  };

  const fetchCoolers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/coolers_available');
      setCoolers(response.data);
      setFilteredCoolers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('No Coolers Available');
    }
  };

  useEffect(() => {
    fetchCoolers();
  }, []);

  const handleAddCoolerButton = () => {
    setEnableAddCoolers(true);
  };

  const handleAddCoolers = async (e) => {
    e.preventDefault();
    console.log(addCoolers);
    if (validateFields()) {
      try {
        const response = await axios.post('http://localhost:5000/api/add_coolers', {
          name: addCoolers.name,
          quantity: addCoolers.quantity,
        });
        if (response.status === 201 || response.status === 200) {
          setCoolers(response.data);
          setFilteredCoolers(response.data);
          setAddCoolers({ name: '', quantity: '' });
          fetchCoolers();
          setEnableAddCoolers(false);
          // Show success alert
          setShowSuccessAlert(true);

          // Hide the alert after 2000 milliseconds (2 seconds)
          setTimeout(() => {
            setShowSuccessAlert(false);
            setEnableAddCoolers(true);
          }, 2000);
        } else {
          console.error('Failed to add coolers:', response.statusText);
          setError('Failed to add coolers');
        }
      } catch (error) {
        console.error('Error adding coolers:', error);
        setError('Error adding coolers');
      }
    }
  };

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);

    if (inputValue === '') {
      setFilteredCoolers(coolers);
    } else {
      const filteredCoolers = coolers.filter((cooler) =>
        cooler.model_name.toLowerCase().includes(inputValue)
      );
      setFilteredCoolers(filteredCoolers);
    }
  };

  return (
    <AppBarPage loggedIn={true}>
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
              <Grid item xs={8} />
            </Grid>
            {filteredCoolers.length > 0 ? (
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Name</StyledTableCell>
                      <StyledTableCell align="center">Quantity Available</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCoolers.map((cooler) => (
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

          <Grid item xs={12} md={6}>
            <Grid container spacing={2} paddingTop={'30px'} >
              <Grid item xs={9} />
              <Grid item xs={3}>
                <Button
                  sx={{
                    backgroundColor: '#1a75ff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#0066ff',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                  onClick={handleAddCoolerButton}
                >
                  Add Coolers
                </Button>
              </Grid>
              <Grid item xs={12} md={8} style={{ paddingLeft: '25%' }}>
                {enableAddCoolers && (
                  <form onSubmit={handleAddCoolers}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <label>Cooler Name:</label>
                      <Autocomplete
                        value={addCoolers.name}
                        onChange={(e, value) => handleInputChange(e, "name",value)}
                        onInputChange={(e, newInputValue) => handleInputChange(e, "name", newInputValue)}
                        options={coolers.map((cooler) => cooler.model_name)}
                        freeSolo
                        renderInput={(params) => (
                          <TextField {...params} style={{ width: '300px', marginBottom: '10px' }} />
                        )}
                      />

                      <label>Quantity:</label>
                      <input
                        type="text"
                        name="quantity"
                        value={addCoolers.quantity}
                        onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                        style={{ width: '300px', marginBottom: '10px', padding: '8px', height:'50px' }}
                        required
                      />

                      <Button
                        sx={{
                          backgroundColor: '#1a75ff',
                          color: '#fff',
                          marginTop: '10px',
                          '&:hover': {
                            backgroundColor: '#0066ff',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                          },
                        }}
                        type="submit"
                        onClick={handleAddCoolers}
                      >
                        Submit
                      </Button>
                    </Box>
                  </form>
                )}
              </Grid>

            </Grid>
          </Grid>
        </Grid>

        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert
            variant = "filled"
            severity="success"
            sx={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
          >
            Successfully updated the coolers
          </Alert>
        )}
      </div>
    </AppBarPage>
  );
};

export default Home;
