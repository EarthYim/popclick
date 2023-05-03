const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
const credentials = require('./key/cred.json');
//const vote = require('./vote')
const candidateInfo = require('./candidate.json');
let countData = { "0": 0, "1": 0 , "2": 0,"3": 0, "4": 0, "5": 0, "6": 0, "7": 0};

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

var options = JSON.parse(fs.readFileSync('./option.json', 'utf-8'));
function updateOptionsData() {
    options = JSON.parse(fs.readFileSync('./option.json', 'utf-8'));
}


function updateCountData() {
    if (parseInt(options.optionA) === 0 || parseInt(options.optionB) === 0) {
        Promise.all([
            TestA.countDocuments(),
        ]).then(([count]) => {
            countData['0'] = count;
        });
    }
    if (parseInt(options.optionA) === 1 || parseInt(options.optionB) === 1) {
        Promise.all([
            TestB.countDocuments(),
        ]).then(([count]) => {
            countData['1'] = count;
        });
    }
    if (parseInt(options.optionA) === 2 || parseInt(options.optionB) === 2) {
        Promise.all([
            ChoiceA.countDocuments(),
        ]).then(([count]) => {
            countData['2'] = count;
        });
    }
    if (parseInt(options.optionA) === 3 || parseInt(options.optionB) === 3) {
        Promise.all([
            ChoiceB.countDocuments(),
        ]).then(([count]) => {
            countData['3'] = count;
        });
    }
    if (parseInt(options.optionA) === 4 || parseInt(options.optionB) === 4) {
        Promise.all([
            ChoiceC.countDocuments(),
        ]).then(([count]) => {
            countData['4'] = count;
        });
    }
    if (parseInt(options.optionA) === 5 || parseInt(options.optionB) === 5) {
        Promise.all([
            ChoiceD.countDocuments(),
        ]).then(([count]) => {
            countData['5'] = count;
        });
    }
    if (parseInt(options.optionA) === 6 || parseInt(options.optionB) === 6) {
        Promise.all([
            ChoiceE.countDocuments(),
        ]).then(([count]) => {
            countData['6'] = count;
        });
    }
    if (parseInt(options.optionA) === 7 || parseInt(options.optionB) === 7) {
        Promise.all([
            ChoiceF.countDocuments(),
        ]).then(([count]) => {
            countData['7'] = count;
        });
    }
}

updateCountData();
updateOptionsData();
setInterval(updateCountData, 1000);
setInterval(updateOptionsData, 10000);

app.get('/api/score', (req, res) => {
    res.status(200).send(countData);
});

app.get('/api/candidateInfo', (req, res) => {
    res.json(candidateInfo);
})

app.get('/api/optionInfo', (req, res) => {
    res.json(options);
})

//Define an endpoint to authenticate the admin using a public key
app.post('/admin/authenticate', function(req, res) {
    const hash = crypto.createHash('sha256');
    hash.update(req.body.key);
    if (hash.digest('hex') === credentials.password) {
      // Create a JWT containing the public key
      const token = jwt.sign('admin', credentials.privatetKey);
      res.json({ token: token });
    //res.status(200).send('Authenticated');
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
      jwt.verify(token, credentials.privatetKey, function(err, decoded) {
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

app.put('/admin/updateOptions', verifyToken, (req, res) => {
    const data = req.body;
    // Read the contents of the option.json file
    const options = JSON.parse(fs.readFileSync('option.json'));
    // Update the values of optionA and optionB
    options.optionA = data.optionA;
    options.optionB = data.optionB;
    // Write the updated contents back to the option.json file
    fs.writeFileSync('option.json', JSON.stringify(options));
    res.status(200).send('Options updated successfully.');
    });

app.post('/api/testA', (req, res) => {
    const data = req.body;
    console.log(`Number of votes for testA: ${data.number_of_count}`);
    if (data.number_of_count < 21) {
        res.status(200).send('testA received');
        // create the number of document that mathces with the number of count
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        // insert the documents using insertMany()
        TestA.insertMany(docsToInsert)
                .then(() => console.log(`testA: ${data.number_of_count} documents inserted.`))
                .catch((err) => console.error(err));
    }
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

app.post('/api/testB', (req, res) => {
    const data = req.body;
    console.log(`Number of votes for testB: ${data.number_of_count}`);
    if (data.number_of_count < 21) {
        res.status(200).send('testB received');
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
        TestB.insertMany(docsToInsert)
                .then(() => console.log(`testB: ${data.number_of_count} documents inserted.`))
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

/* ======================================================================================================================================= */

app.post('/api/voteA', (req, res) => {
    const data = req.body;
    if (data.number_of_count < 21) {
        res.status(200).send('voteA received');
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        ChoiceA.insertMany(docsToInsert)
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

app.post('/api/voteB', (req, res) => {
    const data = req.body;
    if (data.number_of_count < 21) {
        res.status(200).send('voteB received');
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        ChoiceB.insertMany(docsToInsert)
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

// Endpoint for voting on choice C
app.post('/api/voteC', (req, res) => {
    const data = req.body;
    if (data.number_of_count < 21) {
        res.status(200).send('voteC received');
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        ChoiceC.insertMany(docsToInsert)
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

// Endpoint for voting on choice D
app.post('/api/voteD', (req, res) => {
    const data = req.body;
    if (data.number_of_count < 21) {
        res.status(200).send('voteD received');
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        ChoiceD.insertMany(docsToInsert)
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

// Endpoint for voting on choice E
app.post('/api/voteE', (req, res) => {
    const data = req.body;
    if (data.number_of_count < 21) {
        res.status(200).send('voteE received');
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        ChoiceE.insertMany(docsToInsert)
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

// Endpoint for voting on choice F
app.post('/api/voteF', (req, res) => {
    const data = req.body;
    if (data.number_of_count < 21) {
        res.status(200).send('voteF received');
        const docsToInsert = [];
        for (let i = 0; i < data.number_of_count; i++) {
            docsToInsert.push({
            timestamp: Date.now(),
            ip: req.ip,
            });
        }
        ChoiceF.insertMany(docsToInsert)
                .catch((err) => console.error(err));
    } 
    else {
        res.status(200).send('ขอบคุณที่มาร่วมสนุกนะค่ะ');
    }
});

/* ======================================================================================================================================= */

// Serve static files from the 'dist' directory
app.use(express.static('public'))

//Route all requests to the index.html file
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
    
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});