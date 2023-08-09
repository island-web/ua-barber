const mysql = require('mysql2/promise');

( async () => {
    pool = mysql.createPool({ connectionLimit: 10, host: '89.184.68.183', user: 'u_drag_20_ne', password: 'b1JWGhOL', database: 'drag_20_network' });
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`SELECT * FROM services`);
      sessionStorage.setItem('services', JSON.stringify(rows));
    } finally {
      connection.release();
    }
})();