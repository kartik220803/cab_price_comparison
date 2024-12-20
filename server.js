const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/get-fare', (req, res) => {
  console.log("GET request hit");
  return res.json("GET request is working successfully");
});

app.post('/get-fare', (req, res) => {
  const pickup = req.body.pickup;
  const drop = req.body.drop;
  console.log(`Received request: pickup=${pickup}, drop=${drop}`);

  exec(`node main.js "${pickup}" "${drop}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).send('Error executing script');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    // Read and parse fares.json
    fs.readFile('./data/fares.json', 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading fares.json: ${err}`);
        return res.status(500).send('Error reading fares');
      }
      const fares = JSON.parse(data);
      res.json(fares);
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
