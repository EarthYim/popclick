const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
//const vote = require('./vote')
const candidateInfo = require('./candidate.json');
const options = require('./option.json');
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

app.get('/api/candidateInfo', (req, res) => {
    res.json(candidateInfo);
})

app.get('/api/optionInfo', (req, res) => {
    res.json(options);
})

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

const password = "1234";
const privateKey = "myscretissafe"

//Define an endpoint to authenticate the admin using a public key
app.post('/admin/authenticate', function(req, res) {
    const publicKey = req.body.key;
    if (publicKey === password) {
      // Create a JWT containing the public key
      const token = jwt.sign('admin', privateKey);
      res.json({ token: token });
    res.status(200).send('Authenticated');
    } else {
      res.sendStatus(401);
    }
  });

// Define middleware to verify JWTs
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      // Verify the JWT using the secret key
      jwt.verify(token, privateKey, function(err, decoded) {
        if (err) {
          return res.sendStatus(403);
        }   
        req.user = decoded;
        next();
      });
    } 
    else {
      res.sendStatus(401);
    }
}

app.post('/admin/updateOptions', verifyToken, (req, res) => {
    console.log("You have access to update options");
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