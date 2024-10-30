const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); // Import the CORS package

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = [];

app.post('/api/users', (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const user = {
        _id: uuidv4(),
        username,
        exercises: [],
    };

    users.push(user);

    res.json(user);
});

app.get('/api/users', (req, res) => {
    res.json(users);
})

app.post('/api/users/:_id/exercises', (req, res) => {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    const user = users.find(user => user._id === _id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const exercise = {
        description,
        duration: parseInt(duration),
        date: date ? new Date(date) : new Date(), // Ensure date is a string 
    };

    // users.forEach((user) => {
    //     user.exercises = [];
    // })

    user.exercises.push(exercise);

    res.json(user);
});

app.get('/api/users/:_id/logs', (req, res) => {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    const user = users.find((user) => user._id === _id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    let log = user.exercises; // Filter logs based on 'from' and 'to' dates 

    if (from) { const fromDate = new Date(from); log = log.filter(exercise => new Date(exercise.date) >= fromDate); }

    if (to) { const toDate = new Date(to); log = log.filter(exercise => new Date(exercise.date) <= toDate); }
    // Limit the number of logs 
    if (limit) { log = log.slice(0, parseInt(limit)); }

    // Ensure the log entries have the correct formats 
    log = log.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
    }));

    res.json({
        _id: user._id,
        username: user.username,
        count: log.length,
        log: log,
    });
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})