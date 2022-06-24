const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const execSync = require('child_process').execSync;
var bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json());
app.use(cors());

//use bodyParser() to let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  console.log(req.body);
  res.send({
    challenge: "1"
  })
})

app.post('/')

app.post('/realtime', (req, res) => {
  console.log(req.body);
  res.send({
    challenge: req.body.challenge
  })
})

app.post('/query', async (req, res) => {
  let id = uuidv4();
  fs.writeFileSync(`temp_${id}.txt`, req.body.code);

  try {
    execSync(`python3 temp_${id}.txt 2> out_${id}.txt`, {
      timeout: 5000
    });
  } catch (err) {
    let result = fs.readFileSync(`out_${id}.txt`, {encoding: 'utf-8'});
    let negate = result.indexOf("line");
    if (negate !== -1) {
      result = result.slice(negate);
    }
    if (result.length > 0) {
      fs.unlink(`temp_${id}.txt`);
      fs.unlink(`out_${id}.txt`);
      res.send({
        success: false,
        logs: result
      });
    } else {
      fs.unlink(`temp_${id}.txt`);
      fs.unlink(`out_${id}.txt`);
      res.send({
        success: false,
        logs: "time limit exceeded for evaluation"
      });
    }

    return;
  }
  
  res.send({
    success: true
  })
})

// app.post('/query', (req, res) => }

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})