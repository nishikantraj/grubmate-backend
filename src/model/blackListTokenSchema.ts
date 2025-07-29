export const createBlackListToken = `
    CREATE TABLE IF NOT EXISTS blockListToken(
        token TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;