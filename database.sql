USE db_socialmedia;

-- CREATE table Users(
-- 	idUser int NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     username varchar(100) NOT NULL,
--     firstName varchar(100),
--     lastName varchar(100),
--     email varchar(255) NOT NULL,
--     password varchar(255) NOT NULL,
--     CONSTRAINT C_username UNIQUE(username),
--     CONSTRAINT C_email UNIQUE(email)
-- );

-- ALTER TABLE Users
-- ADD media_url varchar(255) DEFAULT '/public/default_user.png';

-- CREATE table Posts(
-- 	idPost int NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     idUser int NOT NULL,
--     title varchar(255) NOT NULL,
--     slug varchar(255) NOT NULL,
--     content longtext NOT NULL,
--     media_url text,
--     idStatus int NOT NULL,
--     create_at datetime DEFAULT CURRENT_TIMESTAMP,
--     update_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- 	FOREIGN KEY (idUser) REFERENCES Users(idUser),
--     FOREIGN KEY (idStatus) REFERENCES Posts_status(idStatus)
-- );

-- CREATE table Posts_status(
-- 	idStatus int NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     name varchar(100)
-- );



-- DROP TABLE Posts;
-- truncate table Posts;

-- SHOW TABLES;
-- SELECT * FROM Users;



