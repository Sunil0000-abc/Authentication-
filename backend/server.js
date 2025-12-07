require('dotenv').config();
const express = require('express');
const app = express();
const cos = require('cors');
const mongoose = require('mongoose');


app.use(cos());



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


const port = 5000;
app.use(express.json());
const userRouter = require('./routes/userRouter');



app.use('/auth', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 