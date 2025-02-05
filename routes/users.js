const express = require('express');
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
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    try {
        const query = `INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
        await sql.query(query);
        res.send("User added successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Insert failed");
    }
});


module.exports = router;