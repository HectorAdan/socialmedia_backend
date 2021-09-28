const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use(fileUpload());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hector',
  password: '1234qwer',
  database: 'db_socialmedia'  
})

connection.connect(error=>{
    if(error) throw error;
    console.log("Database running");
})


app.get('/', (req, res)=>{
  res.send("welcome to mi API")
})

require('./app/routes/UserRoutes')(app, connection);
require('./app/routes/PostsRoutes')(app, connection, __dirname);

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 


module.exports = app;


