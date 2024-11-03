const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../data/users.json');

// Function to read users data from JSON file
function readUsersFromFile() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data); // Attempt to parse JSON
    } catch (error) {
        console.error('Error reading users file:', error);
        return []; // Return an empty array on error
    }
}

let users = readUsersFromFile(); // Load users initially

// Get all users
router.get('/', (req, res) => {
    res.json(users);
});

// Create a new user
router.post('/', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1; // Generate unique ID
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    res.status(201).json(newUser);
});




// Update a user by ID
router.put('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Delete a user by ID
router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
        res.json(deletedUser);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

module.exports = router;
