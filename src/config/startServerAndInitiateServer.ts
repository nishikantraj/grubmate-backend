import pool from '../config/db';
import { createUserTable } from '../model/userSchema';
import { createBlackListToken } from '../model/blackListTokenSchema';
import { createPostTable } from '../model/restaurentSchema';
import { createFoodRatingTable } from '../model/foodRatingSchema';
import { createMediaTable } from '../model/mediaSchema';

export async function startDatabaseAndInitSchema(){    
    try {
        const connection = await pool.getConnection();
        console.log("✅Database connected");
        
        await connection.query(createUserTable);
        await connection.query(createBlackListToken);
        await connection.query(createPostTable);
        await connection.query(createFoodRatingTable);
        await connection.query(createMediaTable);

        console.log('✅ All tables initialized.');
        connection.release();
    }
    catch (error) {
        console.error('❌ Error initializing schema:', error);
    }
}