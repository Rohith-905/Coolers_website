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

// API route for user registration
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Insert the user into the database
    const insertUserQuery = 'INSERT INTO authentication (username, password_hash) VALUES (?, ?)';
    db.query(insertUserQuery, [username, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});
// app.get('/api/data', (req, res) => {

//     res.json({ message: 'Hello from the server!' });
//   });
// API route for user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
   // Find the user in the database
   const findUserQuery = "SELECT * FROM authentication WHERE username = '"+username+"'";
  //  console.log(findUserQuery);
   db.query(findUserQuery, [username], (err, results) => {
     if (err) {
       return res.status(500).json({ error: 'Internal server error' });
     }
 
     // Check if the user doesnt exists
     if (results.length === 0) {
       return res.status(401).json({ error: 'Authentication failed. User not found.' });
     }
 
     const user = results[0];
     // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
