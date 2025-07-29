export const createUserTable = `
    CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        userName VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(500) NOT NULL
    );
`;