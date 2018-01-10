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
  },
  // priority 가 겹치는 것이 있을 때는 update 안겹치면 추가합니다.
  updateChapter : async (body) => {
    let selectSql = `SELECT id from chapter WHERE course_id = ? and priority = ?;`;
    var conn = null;
    var result = {isSuccess : true}
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [body.courseId, body.priority]) || null;
      var recordCount = queryResult.length;
      console.log(queryResult);
      if (recordCount == 1) {
        let updateSql = `UPDATE chapter SET title = ?, info = ? WHERE course_id = ? and priority = ?;`;
        queryResult = await conn.query(updateSql, [body.title, body.info, body.courseId, body.priority]) || null;
      } else if (recordCount > 1) {
        result.isSuccess = false
      } else {
        let insertSql = `INSERT INTO chapter (course_id, info, title, priority) VALUES (?, ?, ?, ?);`;
        queryResult = await conn.query(insertSql, [body.courseId, body.info, body.title, body.priority]) || null;
      }
    } catch (err) {
      next(err);
      result.isSuccess = false;
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  },

  selectLecture : async (chapterId) => {
    let selectSql = `SELECT id, title, lecture_type, info, priority FROM lecture WHERE chapter_id = ? ORDER BY priority ASC;`;
    var conn = null;
    var result = {lectureList: []};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [chapterId]) || null;
      for (var idx in queryResult) {
        var record = queryResult[idx];
        result.lectureList.push({
          id: record.id,
          title: record.title,
          lectureType: record.lecture_type,
          info: record.info,
          priority: record.priority
        });
      }
    } catch (err) {
      next(err);
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  }
}