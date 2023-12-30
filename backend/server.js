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
  password: 'Amruthama@2',
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
    // console.log(results);
    return res.status(200).json(results);
  });
});

// API route to fetch details of products
app.get('/api/customerDetails', (req, res) => {
  const query = 'select * from soldgoods';
  // console.log(query);
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customer details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // console.log(results);
    return res.status(200).json(results);
  });
});

// Handle POST request to store customer data and update coolers count
// app.post('/api/add-customer', async (req, res) => {

//   const formDataList = req.body;
//   let errorOccurred = false; // Flag to track errors

//   // Assuming formDataList is an array of customer data objects
//   for (const formData of formDataList) {
//     let currentQuantity = 0;
    
//     const query = 'SELECT quantity from coolers_available where model_name = "' + formData.model_name + '"';
    
//     try {
//       const results = await queryDatabase(query);

//       if (results.length === 0) {
//         errorOccurred = true;
//         return;
//       }

//       currentQuantity = results[0].quantity;
//       // console.log(currentQuantity);
//       if (currentQuantity < formData.quantity) {
//         errorOccurred = true;
//       } else {
//         // Update coolers count in the MySQL database
//         const updateCoolersQuery = `
//           UPDATE coolers_available 
//           SET quantity = (
//             SELECT derived_table.new_quantity
//             FROM (
//               SELECT quantity - ? AS new_quantity
//               FROM coolers_available
//               WHERE model_name = ?
//             ) AS derived_table
//           )
//           WHERE model_name = ?
//         `;
    
//         const updateCoolersValues = [formData.quantity, formData.model_name, formData.model_name];
//         // console.log(updateCoolersQuery);
//         await queryDatabase(updateCoolersQuery, updateCoolersValues);
    
//         // // Insert customer data into the MySQL database
//         // const insertCustomerQuery = 'INSERT INTO customer SET ?';
//         // // console.log(insertCustomerQuery);
//         // await queryDatabase(insertCustomerQuery, formData);
    
//       }
//     } catch (error) {
//       errorOccurred = true;
//       console.error('Error:', error);
//       break; // Break the loop if an error occurs
//     }
//   }
//   // Check if any error occurred during the iterations
//   if (!errorOccurred) {
//     res.status(200).json({ message: 'Data stored and coolers count updated successfully' });
//   } else {
//     res.status(500).json({ error: 'Failed to store data or update coolers count in the database' });
//   }
// });

app.post('/api/add_coolers', async (req, res) => {
  const addCoolers = req.body;
  // console.log(addCoolers.name,addCoolers.quantity);
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

app.post('/api/saveFormDataAndDetails', async (req, res) => {
  try {
    const { invoiceNumber, formData, additionalDetailsList, paidAmount, overallTotalAmount, dueAmount } = req.body;
    const { customer_name, shop_address, vehicle_number, date } = formData;
    const additionalDetailsJSON = JSON.stringify(additionalDetailsList);
    // console.log(paidAmount,overallTotalAmount);
    const modelDetailsList = additionalDetailsList;
    let errorOccurred = false; // Flag to track errors

    // Assuming formDataList is an array of customer data objects
    for (const modelDetail of modelDetailsList) {
      let currentQuantity = 0;
      
      const query = 'SELECT quantity from coolers_available where model_name = "' + modelDetail.model_name + '"';
      
      try {
        const results = await queryDatabase(query);

        if (results.length === 0) {
          errorOccurred = true;
          return;
        }

        currentQuantity = results[0].quantity;
        // console.log(currentQuantity);
        if (currentQuantity < modelDetail.quantity) {
          errorOccurred = true;
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
      
          const updateCoolersValues = [modelDetail.quantity, modelDetail.model_name, modelDetail.model_name];
          // console.log(updateCoolersQuery);
          await queryDatabase(updateCoolersQuery, updateCoolersValues);
        }
      } catch (error) {
        errorOccurred = true;
        console.error('Error:', error);
        break; // Break the loop if an error occurs
      }
    }
   
    const query = 'INSERT INTO soldgoods (invoice_number, customer_name, shop_address, vehicle_number, date, additional_details_json,paidAmount,overallTotalAmount, dueAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [invoiceNumber, customer_name, shop_address, vehicle_number, date, additionalDetailsJSON, paidAmount, overallTotalAmount, dueAmount];

    // Replace the null value with the SQL NULL keyword
    values[8] = dueAmount !== null ? dueAmount : null;

    await queryDatabase(query, values);

    res.status(200).send('Data saved to the backend');
  } catch (error) {
    console.error('Error saving data to the backend:', error);
    res.status(500).send('Failed to save data to the backend');
  }
});

app.get('/api/get_amountDetails', async (req, res) => {
  const customerName = req.query.name;
  // console.log('customerName', customerName);

  try {
    const get_amountDetails = 'select remaining from maintain_due_advance where name = ?';
    const amount = await queryDatabase(get_amountDetails, customerName);
    // Note: 'results' should be used instead of 'error' in the following condition
    if (amount.error) {
      console.error('Error fetching amount details:', amount.error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      // console.log(amount[0]);
      res.status(200).json(amount[0]);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to store data or update cooler count in the database' });
  }
});

app.get('/api/getDetailsByInvoiceNumber', (req, res) => {
  // console.log("in server");
  const invoiceNumber = req.query.invoiceNumber;
  const query = 'SELECT * FROM soldgoods WHERE invoice_number = ?';

  db.query(query, invoiceNumber, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'No data found for the invoice number' });
      return;
    }
    // console.log(results);
    res.status(200).send(results);
  });
});

app.post('/api/updateDueAmount', async(req,res) =>{
  const {remainingAmount, name} = req.body;
  const query = `select * from maintain_due_amount where name = ${name}`;
  db.query(query,(error,results) =>{
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }

    if (results.length === 0) {
      const query = `insert into maintain_due_amount values (${name},${remainingAmount})`;
      db.query(query,(error,results) =>{
        if(error){
          res.status(500).json({ error: 'Failed to fetch data' });
          return;
        }
      });
    }
    else{
      const query = 
    }
  })
})
// Helper function to execute queries on the database
function queryDatabase(query, values) {
  // console.log(query, values);
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, results) => {
      if (error) {
        // Use the 'error' variable here
        reject( error );
      } else {
        // console.log(results);
        resolve( results );
      }
    });
  });
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
