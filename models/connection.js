const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

mongoose
  // Short timeout avoids hanging cold starts when DB is unreachable.
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
