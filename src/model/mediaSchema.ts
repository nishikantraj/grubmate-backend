export const createMediaTable = `
    CREATE TABLE IF NOT EXISTS media(
        mediaId VARCHAR(255) PRIMARY KEY,
        postId VARCHAR(255) NOT NULL,
        fileName VARCHAR(255) NOT NULL,
        mimeType VARCHAR(100) NOT NULL,
        size INT NOT NULL,
        compressedImage LONGBLOB NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES posts(postId)
    );
`; 