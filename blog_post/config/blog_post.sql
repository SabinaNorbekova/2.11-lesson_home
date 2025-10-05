-- CREATE DATABASE blog_post;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50),
    address VARCHAR(100)
);
CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    content TEXT,
    post_id INTEGER REFERENCES posts(post_id),
    user_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);