const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://admin:cluster@cluster.mongodb.net/blogAppDB')
    .then(() => console.log('Database connected'))
    .catch(err => console.error(err));

app.post('/api/signup', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const existingUser = await User.find({ email });
        if (existingUser.length > 0) {
            return res.json({ status: "email already exists" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({ name, phone, email, password: hashedPassword });
        await newUser.save();
        res.json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRecords = await User.find({ email });
        if (userRecords.length === 0) {
            return res.json({ status: "invalid email id" });
        }
        const user = userRecords[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.json({ status: "incorrect password" });
        }
        jwt.sign({ email: user.email }, 'blogAppSecretKeyKey', { expiresIn: '1d' }, (err, token) => {
            if (err) return res.json({ status: "error" });
            res.json({ status: "success", token: token, userId: user._id });
        });
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
});

const PORT = 3030;
app.listen(PORT, () => console.log(`Server executing on port ${PORT}`));