const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/users.js');

const config = require('./config.js')

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', userRoutes);

const CONNECTION_URL = config.DBURL;
const PORT = 15000;


mongoose.connect(CONNECTION_URL).then( () => app.listen(PORT, () =>{console.log(`Server Running on Port: http://localhost:${PORT}`)}))
	.catch((error)=>{console.log(`${error} did not connect`)});
/*
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);
*/
