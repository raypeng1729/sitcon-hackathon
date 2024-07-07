const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

//JSON file
//const jsonFilePath = path.join(__dirname, 'data.json');
const votesFilePath = path.join(__dirname, 'votes.json');

app.use(express.json());

// Ensure the JSON file exists and is properly formatted
/*if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, JSON.stringify([]));
} else {
    try {
        JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (error) {
        fs.writeFileSync(jsonFilePath, JSON.stringify([]));
    }
}*/

app.post('/vote', (req, res) => {
    console.log("HELLO");
    const { topic, opinion } = req.body;
    fs.readFile(votesFilePath, (err, data) => {
        if (err) return res.status(500).send('Error reading votes file.');
        const votes = JSON.parse(data);
        if (!votes[topic]) {
            votes[topic] = { agree: 0, disagree: 0, noOpinion: 0 };
        }
        if (opinion in votes[topic]) {
            votes[topic][opinion]++;
        }
        fs.writeFile(votesFilePath, JSON.stringify(votes, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing votes file.');
            res.json(votes[topic]);
        });
    });
});

app.get('/results', (req, res) => {
    const { topic } = req.query;
    fs.readFile(votesFilePath, (err, data) => {
        if (err) return res.status(500).send('Error reading votes file.');
        const votes = JSON.parse(data);
        res.json(votes[topic] || { agree: 0, disagree: 0, noOpinion: 0 });
    });
});

app.post('/update_json', (req, res) => {
    const { inputString } = req.body;
    fs.readFile(votesFilePath, (err, data) => {
        if (err) return res.status(500).send('Error reading votes file.');
        const votes = JSON.parse(data);
        if (!votes.proposals) {
            votes.proposals = [];
        }
        votes.proposals.push(inputString);
        if (!votes[inputString]) {
            votes[inputString] = { agree: 0, disagree: 0, noOpinion: 0 };
        }
        fs.writeFile(votesFilePath, JSON.stringify(votes, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing votes file.');
            res.json({ message: 'Proposal added successfully.' });
        });
    });
});

app.get('/get_topics', (req, res) => {
    fs.readFile(votesFilePath, (err, data) => {
        if (err) return res.status(500).send('Error reading votes file.');
        const votes = JSON.parse(data);
        const topics = Object.keys(votes).filter(key => key !== 'proposals');
        res.json({ topics });
    });
});


// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the HTML file
app.get('/add.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'add.html'));
});

// Endpoint to update the JSON file
/*app.post('/update_json', (req, res) => {
    const { inputString } = req.body;

    if (!inputString) {
        return res.status(400).json({ message: 'Input string is required!' });
    }

    let jsonData;
    try {
        jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (error) {
        return res.status(500).json({ message: 'Error reading JSON file' });
    }

    const newId = jsonData.length > 0 ? Math.max(...jsonData.map(item => item.id)) + 1 : 1;
    
    const newEntry = {
        id: newId,
        title: inputString,
        agree: 0,
        disagree: 0,
        noOpinion: 0
    };

    jsonData.push(newEntry);
    
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 4));

    res.json({ message: 'String added to JSON file successfully!' });
});*/

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the CSV file
app.get('/students.csv', (req, res) => {
    res.sendFile(path.join(__dirname, 'students.csv'));
});

// Serve the script file
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/homepage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.get('/menu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

app.get('/vote.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'vote.html'));
});

/*app.get('/script_home.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script_home.js'));
});

app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
});

app.get('/proposals.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'proposals.json'));
});*/

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
