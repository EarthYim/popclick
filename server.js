const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const vote = require('./vote')
let countData = { countA: 0, countB: 0 };

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

ChoiceA = mongoose.model('Choice-a', voteSchema);
ChoiceB = mongoose.model('Choice-b', voteSchema);
ChoiceC = mongoose.model('Choice-c', voteSchema);
ChoiceD = mongoose.model('Choice-d', voteSchema);
ChoiceE = mongoose.model('Choice-e', voteSchema);
ChoiceF = mongoose.model('Choice-f', voteSchema);
TestA = mongoose.model('Test-a', voteSchema);
TestB = mongoose.model('Test-b', voteSchema);

function updateCountData() {
    Promise.all([
        ChoiceA.countDocuments(),
        ChoiceB.countDocuments(),
    ]).then(([countA, countB]) => {
        countData.countA = countA;
        countData.countB = countB;
    });
}
updateCountData();
setInterval(updateCountData, 1000);

app.get('/api/score', (req, res) => {
    res.status(200).send(countData);
});

app.post('/api/voteA', (req, res) => {
    const data = req.body;
    console.log(`Number of votes for A: ${data.number_of_count}`);
    if (data.number_of_count < 21) {
        res.status(200).send('VoteA received');
        // create the number of document that mathces with the number of count
        // create an array of documents to insert
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        // insert the documents using insertMany()
        ChoiceA.insertMany(docsToInsert)
                .then(() => console.log(`${data.number_of_count} documents inserted.`))
                .catch((err) => console.error(err));
    }
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

app.post('/api/voteB', (req, res) => {
    const data = req.body;
    console.log(`Number of votes for B: ${data.number_of_count}`);
    if (data.number_of_count < 21) {
        res.status(200).send('VoteB received');
        // create the number of document that mathces with the number of count
        // create an array of documents to insert
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        // insert the documents using insertMany()
        ChoiceB.insertMany(docsToInsert)
                .then(() => console.log(`${data.number_of_count} documents inserted.`))
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
    
});

// Serve static files from the 'dist' directory
app.use(express.static('public'))

//Route all requests to the index.html file
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
    
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});