const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = [];

app.post('/api/users', (req, res) => {
    const { username } = req.body;
    const newUser = { username, _id: uuidv4()}
    users.push(newUser);
    res.json(newUser);
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})