const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const todosFilePath = path.join(__dirname, '../data/todos.json');

let todos;

try {
    const data = fs.readFileSync(todosFilePath, 'utf-8');
    todos = data ? JSON.parse(data) : []; // Initialize with an empty array if no data
} catch (error) {
    console.error('Error reading or parsing todos.json:', error);
    todos = []; // Fallback to an empty array in case of error
}

// Get all todos
router.get('/', (req, res) => {
    res.json(todos);
});

// Create a new todo
router.post('/', (req, res) => {
    const newTodo = req.body;
    newTodo.id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1; // Generate unique ID
    todos.push(newTodo);
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
    res.status(201).json(newTodo);
});

// Update a todo by ID
router.put('/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...req.body };
        fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

// Delete a todo by ID
router.delete('/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (todoIndex !== -1) {
        const deletedTodo = todos.splice(todoIndex, 1);
        fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
        res.json(deletedTodo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

module.exports = router;
