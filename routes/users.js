const express = require('express');
const bcrypt = require('bcryptjs'); 
const router = express.Router();
const sql = require('mssql');

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

module.exports = router;
