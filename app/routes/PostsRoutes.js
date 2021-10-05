function slugify(string) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
}


module.exports = function(app, connection, dir_name){

     // get all posts
     app.get('/api/post-get-all', (req, res)=>{
        const sql  = "SELECT Posts.*, Users.firstName FROM Posts, Users WHERE Post.idUser=Users.idUser ORDER BY idPost DESC ";
        connection.query(sql, (error, results) =>{
            if(error) throw error;
            if(results.length >0){
                const response = {
                    ok: true,
                    message: results.length+ " posts found",
                    posts: results
                }
                res.json(response);
            }else{
                const response = {
                    ok: false,
                    message: "No posts created"
                }
                res.send(response)
            }
        })
    })
    // get post by id
    app.get('/api/post-find-by-id/:id', (req, res)=>{
        const {id} = req.params;
        const sql  = `SELECT * FROM Posts WHERE idPost = ${id} LIMIT 1`;
        connection.query(sql, (error, result) =>{
            if(error) throw error;
            if(result.length > 0){
                const response = {
                    ok: true,
                    message: "Post found",
                    post: result[0]
                }
                res.json(response);
            }else{
                const response = {
                    ok: false,
                    message: `Post with id ${id} not found`
                }
                res.send(response)
            }
        })
    })

     // create
    app.post('/api/post-create', (req, res)=>{
        const sql  = "INSERT INTO Posts SET ?";

        if (req.files){ //ss
            if (req.files || Object.keys(req.files).length !== 0) {
                
                let file = req.files.media_url;
                let date = new Date();
                let file_name = date.getFullYear()+"_"+ date.getMonth()+ "_"+date.getDate()+ date.getHours()+"_"+date.getMinutes()+"_"+date.getSeconds()+"_"+file.name;
                
                var fs = require('fs');
                var dir = dir_name+'/public/user_'+req.body.idUser+'/posts';

                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir, { recursive: true });
                }

                let uploadPath = dir+ "/" + file_name;

                file.mv(uploadPath, function(err) {
                    if (err){ return res.status(500).send(err);}
                    else{
                        const userData = {
                            "idUser": req.body.idUser,
                            "title": req.body.title,
                            "content": req.body.content,
                            "idStatus": 1,
                            "media_url": '/public/user_'+req.body.idUser+'/posts/'+ file_name,
                            "slug": slugify(req.body.title)
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
                                    message: "Post created"
                                }
                                res.send(response);
                            }
                        })
                    }
                });
            
            }else{
                return res.status(400).send('No files were uploaded in the field');
            }

        } else{
            const userData = {
                "idUser": req.body.idUser,
                "title": req.body.title,
                "content": req.body.content,
                "idStatus": 1,
                "slug": slugify(req.body.title)
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
                        message: "Post created"
                    }
                    res.send(response);
                }
            })
        }
        
    })

    //update
    app.put('/api/post-update/:id' , (req, res)=>{
        const {id} = req.params;
        const {title, content, media_url} = req.body;
        let media_sql =""
        if(media_url){
            media_sql = ", media_url="+media_url;
        }
        if(!title){
            const response = {
                ok: false,
                message: "title is required"
            }
            res.send(response)
        }else if(!content){
            const response = {
                ok: false,
                message: "content is required"
            }
            res.send(response)
        }else{
            const sql = `UPDATE Posts SET title = '${title}', slug = '${slugify(title)}',  content = '${content}' `+media_sql+` 
            WHERE idPost = ${id}`;
            connection.query(sql, error=>{
                if(error) throw error;
                res.send("Post successfully updated!")
            })
        }
    })

     //delete
     app.delete('/api/post-delete/:id', (req, res)=>{
        const {id} = req.params;
        const sql_find = `SELECT * FROM Posts WHERE idPost = ${id}`;
        const sql_delete = `DELETE FROM Posts WHERE idPost = ${id}`;
        connection.query(sql_find, (error, result)=>{
            if(error) throw error;
            if(result.length > 0){
                connection.query(sql_delete, error1=>{
                    if(error1) throw error1;
                    res.send(`Post with id ${id} successfully deleted`);
                })
            }else{
                res.send(`Post with id ${id} not found`);
            }
        })
    })
}
