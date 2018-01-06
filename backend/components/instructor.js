const mysql = require('promise-mysql');
const pool = mysql.createPool(require('../config/db_config.json'));

module.exports = {
    insertInstructorInfo : async (name, thumnailPath) => {
        let sql = `INSERT INTO supplier (name, thumbnail_path) VALUES (?, ?);`;
        var conn = null
        try {
            conn = await pool.getConnection();
            let query = await conn.query(sql, [name, thumnailPath]);
        } catch(err) {
            console.log("in catch");
            next(err);
        } finally {
            console.log("in finally");
            pool.releaseConnection(conn);
        }
    },
    selectInstructorInfo : async () => {
        let sql = `SELECT id, name from supplier;`;
        var conn = null;
        var result = { data: [] };
        try {
            conn = await pool.getConnection();
            var queryResult = await conn.query(sql) || null;
            for (var idx in queryResult) {
                result.data.push(
                    {
                        id: queryResult[idx].id, 
                        name: queryResult[idx].name
                    }
                );
            }
        } catch(err) {
            next(err); 
        } finally {
            pool.releaseConnection(conn);
            return result;
        }
    }
}