const pool = require('promise-mysql').createPool(require('../config/db_config.json'));

module.exports = {
  selectCourse : async (id) => {
    let sql = `SELECT id, title FROM course WHERE course.supplier_id = ?;`;
    var conn = null;
    var result = {courseList: []};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(sql, [id]) || null;
      for (var idx in queryResult) {
        result.courseList.push(
          {
            id: queryResult[idx].id,
            title: queryResult[idx].title
          }
        )
      }
    } catch(err) {
      next(err);
    } finally {
      pool.releaseConnection(conn);
      console.log(result);
      return result;
    }
  },

  insertCourse : async () => {

  }
}