const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
//const vote = require('./vote')

const app = express();
const port = process.env.PORT || 3000;

var cors = require('cors');
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/click_test', { useNewUrlParser: true });

const voteSchema = new mongoose.Schema({
    timestamp: Date,
    ip: String,
});

ChoiceA = mongoose.model('ChoiceA', voteSchema);
ChoiceB = mongoose.model('ChoiceB', voteSchema);

app.get('/score', (req, res) => {
    Promise.all([
        ChoiceA.countDocuments(),
        ChoiceB.countDocuments(),
    ]).then(([countA, countB]) => {
        res.status(200).send({ countA, countB });
    });
});

app.post('/voteA', (req, res) => {
    const data = req.body;
    console.log(`Number of votes for A: ${data.number_of_count}`);
    res.status(200).send('VoteA received');
    // create the number of document that mathces with the number of count
    ChoiceA.create({
        timestamp: Date.now(),
        ip: req.ip,
    });
});

app.post('/voteB', (req, res) => {
    const data = req.body;
    console.log(`Number of votes for B: ${data.number_of_count}`);
    res.status(200).send('VoteB received');
    // create the number of document that mathces with the number of count
    ChoiceB.create({
        timestamp: Date.now(),
        ip: req.ip,
    });
    
});
    
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});