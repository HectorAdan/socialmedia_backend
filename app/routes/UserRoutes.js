const md5 = require("md5");

module.exports = function(app, connection){

    //login user
    app.post('/api/user-login', (req, res)=>{
        const {username, password} = req.body;
        if(!username){
            const response = {
                ok: false,
                message: "username is required"
            }
            res.send(response)
        }else if(!password){
            const response = {
                ok: false,
                message: "password is required"
            }
            res.send(response)
        }else{
            const check_user_exist  = `SELECT * FROM Users WHERE username = '${username}' OR email = '${username}' LIMIT 1`;
            connection.query(check_user_exist, (error, results) =>{
                if(error) throw error;
                if(results.length >0){
                    const check_password  = `SELECT * FROM Users WHERE idUser =${results[0].idUser} AND password = '${md5(password)}' LIMIT 1`;
                    connection.query(check_password, (error, results) =>{
                        if(error) throw error;
                        if(results.length >0){
                            const response = {
                                ok: true,
                                message: "Users found",
                                user: {
                                    idUser: results[0].idUser,
                                    username: results[0].username,
                                    email: results[0].email
                                }
                            }
                            res.json(response);
                        }else{
                            const response = {
                                ok: false,
                                message: "Invalid credentials"
                            }
                            res.send(response)
                        }
                    })
                }else{
                    const response = {
                        ok: false,
                        message: "No user registered with that username or email"
                    }
                    res.send(response)
                }
            })
        }
    })

    // find all users
    app.get('/api/user-find-all', (req, res)=>{
        const sql  = "SELECT * FROM Users";
        connection.query(sql, (error, results) =>{
            if(error) throw error;
            if(results.length >0){
                const response = {
                    ok: true,
                    message: "Users found",
                    users: results
                }
                res.json(response);
            }else{
                const response = {
                    ok: false,
                    message: "No users found"
                }
                res.send(response)
            }
        })
    })

    // user find by id
    app.get('/api/user-find-by-id/:id', (req, res)=>{
        const {id} = req.params;
        const sql  = `SELECT * FROM Users WHERE idUser = ${id} LIMIT 1`;
        connection.query(sql, (error, result) =>{
            if(error) throw error;
            if(result.length > 0){
                const response = {
                    ok: true,
                    message: "User found",
                    user: result[0]
                }
                res.json(response);
            }else{
                const response = {
                    ok: false,
                    message: `User with id ${id} not found`
                }
                res.send(response)
            }
        })
    })

    // create
    app.post('/api/user-create', (req, res)=>{
        const sql  = "INSERT INTO Users SET ?";

        const userData = {
            "username": req.body.username,
            "email": req.body.email,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "password": md5(req.body.password)
        };
        connection.query(sql, userData, error=>{
            if(error) {
                const response = {
                    ok: false,
                    code: error.code,
                    message: 
                        error.code === "ER_DUP_ENTRY" 
                            ? 
                                error.sqlMessage
                            : 
                                "Error creating user"
                }
                res.send(response)
            }else{
                const response = {
                    ok: true,
                    message: "User created"
                }
                res.send(response);
            }
        })
    })

    //delete
    app.delete('/api/user-delete/:id', (req, res)=>{
        const {id} = req.params;
        const sql_find = `SELECT * FROM Users WHERE idUser = ${id}`;
        const sql_delete = `DELETE FROM Users WHERE idUser = ${id}`;
        connection.query(sql_find, (error, result)=>{
            if(error) throw error;
            if(result.length > 0){
                connection.query(sql_delete, error1=>{
                    if(error1) throw error1;
                    res.send(`User with id ${id} successfully deleted`);
                })
            }else{
                res.send(`User with id ${id} not found`);
            }
        })
    })

    //update
    app.put('/api/user-update/:id' , (req, res)=>{
        const {id} = req.params;
        const {firstName, lastName} = req.body;
        if(!firstName){
            const response = {
                ok: false,
                message: "firstName is required"
            }
            res.send(response)
        }else if(!lastName){
            const response = {
                ok: false,
                message: "lastName is required"
            }
            res.send(response)
        }else{
            const sql = `UPDATE Users SET firstName = '${firstName}', lastName = '${lastName}' 
            WHERE idUser = ${id}`;
            connection.query(sql, error=>{
                if(error) throw error;
                res.send("User successfully updated!")
            })
        }
    })

}