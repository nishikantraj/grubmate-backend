import mysql, { PoolOptions , Pool} from 'mysql2/promise';

// Connection config
const access: PoolOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Developer12@#',
  database: 'test',
};

const pool:Pool = mysql.createPool(access);
export default pool;