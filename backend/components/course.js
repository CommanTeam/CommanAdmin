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

  insertCourse : async (body, filePath) => {
    let sql = `INSERT INTO course (title, supplier_id, opened_chapter, image_path, info, category_id, price) VALUES (?, ?, ?, ?, ?, ?, ?);`
    var conn = null;
    try {
      conn = await pool.getConnection();
      let query = await conn.query(sql, 
        [
          body.title, 
          body.supplierID, 
          body.chapterCount,
          filePath,
          body.courseInfo,
          body.categoryID,
          body.coursePrice
        ]
      );
    } catch(err) {
      next(err);
    } finally {
      pool.releaseConnection(conn);
    }
  },

  selectChapter : async (id) => {
    let sql = `SELECT id, title, info, priority FROM chapter WHERE course_id = ? order by priority asc;`;
    var conn = null;
    var result = { chapterList: []};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(sql, [id]) || null;
      for (var idx in queryResult) {
        result.chapterList.push(
          {
            id: queryResult[idx].id,
            title: queryResult[idx].title,
            info: queryResult[idx].info,
            priority: queryResult[idx].priority
          }
        )
      }
    } catch (err) {
      next(err);
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  }
}