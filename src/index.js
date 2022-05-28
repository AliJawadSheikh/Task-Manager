const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(userRouter, taskRouter);

//------------------------------------
// Server Configurations
//------------------------------------

app.listen(port, () => {
    console.log('Server has been started on port: ' + port)
})