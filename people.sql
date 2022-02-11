CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    phone INT ,
    age INT,
    role ENUM('0','1') DEFAULT '0',
    avatar_path VARCHAR(255) NOT NULL DEFAULT '',
    isActive BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CREATE TABLE photos (
--     id INTEGER AUTO_INCREMENT PRIMARY KEY,
--     image_path VARCHAR(255) NOT NULL,
--     user_id INTEGER NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW(),
--     FOREIGN KEY(user_id) REFERENCES users(id)
-- );




