const express = require('express');
const app = express();
const usersRouter = require('./routes/usersroute');
const todosRouter = require('./routes/todosroute');

app.use(express.json()); // Parse JSON bodies

// Set up routes for Users and Todos
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
