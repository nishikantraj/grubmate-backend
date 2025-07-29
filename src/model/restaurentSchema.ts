export const createPostTable = `
    CREATE TABLE IF NOT EXISTS posts(
        postId varchar(255) PRIMARY KEY,
        restaurantName varchar(255) NOT NULL,
        title varchar(255) NOT NULL,
        description text NOT NULL,
        isPrivate boolean default false,
        createdAt timestamp default current_timestamp,
        userId int NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
    );
`;