const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/users');
const deckRoutes = require('./routes/decks');
const cardRoutes = require('./routes/cards');
const quizRoutes = require('./routes/quiz');

// const config = require('./config.js')

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', userRoutes);
app.use('/decks', deckRoutes);
app.use('/cards', cardRoutes);
app.use('/quiz', quizRoutes);

const CONNECTION_URL = process.env.DBURL || "mongodb://localhost:27017/flashy";
const PORT = process.env.PORT || 15000;


mongoose.connect(CONNECTION_URL).then(() => app.listen(PORT, () => { console.log(`Server Running on Port: http://localhost:${PORT}`) }))
  .catch((error) => { console.log(`${error} did not connect`) });

/*
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);
*/
