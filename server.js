const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const dbURI = 'mongodb://localhost:27017/mongonode';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    name: String,
    image: String,
    bio: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', async (req, res) => {
    try{
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the User API!');
});
app.listen(port, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log('Waiting for requests...');
})