const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Coolers',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const insertUserQuery = "INSERT INTO authentication (username, password) VALUES ('"+username+"','"+hashedPassword+"')";
    
    // Using promise to handle the database query
    await db.promise().execute(insertUserQuery, [username, hashedPassword]);

    // Registration successful
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);

    // Handle specific bcrypt errors
    if (error.name === 'BcryptError') {
      return res.status(500).json({ error: 'Password hashing error' });
    }

    res.status(500).json({ error: 'DB Internal server error' });
  }
});

// API route for user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // console.log(username,password);
   // Find the user in the database
   const findUserQuery = "SELECT * FROM authentication WHERE username = '"+username+"'";
  //  console.log(findUserQuery);
   db.query(findUserQuery, [username], (err, results) => {
     if (err) {
       return res.status(500).json({ error: 'DB Internal server error' });
     }
 
     // Check if the user doesnt exists
     if (results.length === 0) {
       return res.status(401).json({ error: 'Authentication failed. User not found.' });
     }
 
     const user = results[0];
    //  console.log(JSON.stringify(user));
     // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'bcrypt Internal server error' });
      }

      if (isMatch) {
        // Passwords match, authentication successful
        return res.status(200).json({ message: 'Login successful' });
      } else {
        // Passwords don't match, authentication failed
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
      }
    });

  });
});

// API route to fetch details of products
app.get('/api/coolers_available', (req, res) => {
  const query = 'SELECT * FROM coolers_available';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cooler details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json(results);
  });
});

// API route to fetch details of products
app.get('/api/customerDetails', (req, res) => {
  const query = 'SELECT * FROM customer';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customer details:', err);
      
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json(results);
  });
});

// Handle POST request to store customer data and update coolers count
app.post('/api/add-customer', async (req, res) => {
  let currentQuantity = 0;
  const formData = req.body;
  const query = 'SELECT quantity from coolers_available where model_name = "' + formData.model_name + '"';
  
  try {
    const results = await queryDatabase(query);

    if (results.length === 0) {
      res.status(500).json({ error: 'Cooler not found' });
      return;
    }

    currentQuantity = results[0].quantity;
    // console.log(currentQuantity);
    if (currentQuantity < formData.quantity) {
      // console.log("In if");
      res.status(500).json({ error: 'Sufficient Quantity is not available. Available quantity is ',currentQuantity });
    } else {
      // Update coolers count in the MySQL database
      const updateCoolersQuery = `
        UPDATE coolers_available 
        SET quantity = (
          SELECT derived_table.new_quantity
          FROM (
            SELECT quantity - ? AS new_quantity
            FROM coolers_available
            WHERE model_name = ?
          ) AS derived_table
        )
        WHERE model_name = ?
      `;
  
      const updateCoolersValues = [formData.quantity, formData.model_name, formData.model_name];
      await queryDatabase(updateCoolersQuery, updateCoolersValues);
  
      // Insert customer data into the MySQL database
      const insertCustomerQuery = 'INSERT INTO customer SET ?';
      await queryDatabase(insertCustomerQuery, formData);
  
      // Respond with success
      return res.status(200).json({ message: 'Data successfully stored, and coolers count updated in the database!' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to store data or update coolers count in the database' });

  }
});
app.post('/api/add_coolers', async (req, res) => {
  const addCoolers = req.body;
  console.log(addCoolers.name,addCoolers.quantity);
  try {
    // Check if the cooler already exists
    const checkCoolerQuery = 'SELECT quantity FROM coolers_available WHERE model_name = ?';
    const [existingCooler] = await queryDatabase(checkCoolerQuery, [addCoolers.name]);

    if (!existingCooler) {
      // Cooler doesn't exist, insert a new record
      const insertCoolerQuery = 'INSERT INTO coolers_available (model_name, quantity) VALUES (?, ?)';
      await queryDatabase(insertCoolerQuery, [addCoolers.name, addCoolers.quantity]);

      res.status(201).json({ message: 'Cooler added successfully' });
    } else {
      // Cooler exists, update the quantity
      const updateCoolerQuery = 'UPDATE coolers_available SET quantity = ? WHERE model_name = ?';
      const newQuantity = parseInt(existingCooler.quantity, 10) + parseInt(addCoolers.quantity, 10);
      await queryDatabase(updateCoolerQuery, [newQuantity, addCoolers.name]);

      res.status(200).json({ message: 'Cooler quantity updated successfully' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to store data or update cooler count in the database' });
  }
});

// Display raw Materials
app.get('/api/rawmaterialDetails', (req, res) => {
  const query = 'SELECT * FROM RawMaterial';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching RawMaterial details:', err);
      
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json(results);
  });
});

// Add RawMaterial
app.post('/api/add-rawmaterial', async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  const materialName = formData.Material_name;
  const quantity =  Number(formData.quantity);
  console.log(materialName,quantity)

  try {
    // Check if the material already exists in the database
    const checkQuery = `SELECT * FROM RawMaterial WHERE Material_Name = '${materialName}'`;
    const checkResult = await queryDatabase(checkQuery);

    if (checkResult.length > 0) {
      // Material exists, update the quantity
      const currentQuantity =  Number(checkResult[0].quantity);
      const newQuantity = currentQuantity + quantity;
      const updateQuery = `UPDATE RawMaterial SET quantity = ${newQuantity} WHERE Material_Name = '${materialName}'`;
      await queryDatabase(updateQuery);
      console.log('Quantity updated successfully')
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      // Material doesn't exist, insert a new row
      const insertQuery = `INSERT INTO RawMaterial (Material_Name, quantity) VALUES ('${materialName}', ${quantity})`;
      await queryDatabase(insertQuery);
      console.log('Quantity added successfully')
      res.status(200).json({ message: 'New material added successfully' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to execute queries on the database
function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
