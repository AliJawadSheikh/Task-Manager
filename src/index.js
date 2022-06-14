const app = require('./app');
const port = process.env.PORT;

//------------------------------------
// Server Configurations
//------------------------------------

app.listen(port, () => {
    console.log('Server has been started on port: ' + port)
})