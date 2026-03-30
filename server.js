const dotenv = require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  mongoose.connect(DB).then(() => {
  console.log('success!');
});

////// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port} ...`);
});

