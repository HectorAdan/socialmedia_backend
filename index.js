const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
// const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT || 5050;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use(fileUpload());

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'hector',
//   password: '1234qwer',
//   database: 'db_socialmedia'  
// })

const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'cursoreactnative',
    password: '1234qwer',
    database: 'db_socialmedia'  
})

connection.connect(error=>{
    if(error) throw error;
    console.log("Database running");
});

require('./app/routes/UserRoutes')(app, connection);
require('./app/routes/PostsRoutes')(app, connection, __dirname);

const home = require('./app/routes/HomeRoutes');
app.use('/', home)


app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 


