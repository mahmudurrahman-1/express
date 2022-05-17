const express = require('express');
const fs = require('fs');
//calling express int to a variable
const app = express();

// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the Server side');
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this url');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
app.get('/api/v1/tours', (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//when Using variable in the url 1/2/3/4/5 any
app.get('/api/v1/tours/:id', (req, res) => {
  //req.params is the value of :id in the url
  const id = req.params.id * 1;
  //using find method in an array is to find something using a condition
  const tour = tours.find((el) => {
    return el.id === id;
  });
  if (id > tours.length) {
    return res.status(404).json({
      status: 'Failed',
      Message: 'Nothing found',
    });
  }
  res.json({
    status: 'success',
    data: tour,
  });
});
//Using express.json() in order to use middleware
app.use(express.json());
//create object using post method
app.post('/api/v1/tours', (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newObj = Object.assign({ id: newID }, req.body);
  tours.push(newObj);
  fs.writeFile('newTours.json', JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: tours,
      },
    });
  });
});

const port = 3000;
//startup a server
app.listen(port, () => {
  console.log('Application server has been started');
});
