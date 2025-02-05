const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add jwt package
const router = express.Router();
const sql = require('mssql');

// Secret key for JWT (you should keep it in a safe place like environment variables)
const JWT_SECRET = 'your_jwt_secret_key'; 

// GET all users
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Users');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// POST a new user
router.post('/', async function (req, res) {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;
        await sql.query(query);

        res.status(201).send("User added successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Insert failed");
    }
});

// POST login (authenticate user)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const result = await sql.query`SELECT * FROM Users WHERE email = ${email}`;

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result.recordset[0];

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token in the response
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;