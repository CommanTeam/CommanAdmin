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
    var result = {isSuccess : true};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [body.courseId, body.priority]) || null;
      var recordCount = queryResult.length;
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
    let selectSql = `SELECT id, title, type, info, priority FROM lecture WHERE chapter_id = ? ORDER BY priority ASC;`;
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
          lectureType: record.type,
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
  },

  uploadVideo : async (body) => {
    let selectSql = `SELECT id from lecture WHERE chapter_id = ? and priority = ?;`;
    var conn = null;
    var result = {isSuccess : true};
    console.log(body);
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [body.chapterId, body.priority]) || null;
      var recordCount = queryResult.length;
      if (recordCount > 1) {
        result.isSuccess = false
      } else {
        if (recordCount == 1) {
          let deleteSql = 'DELETE FROM lecture WHERE chapter_id = ? and priority =?;';
          queryResult = await conn.query(deleteSql, [body.chapterId, body.priority]) || null;
        }
        var lectureInsertSql = `INSERT INTO lecture (chapter_id, title, info, priority, type) VALUES (?, ?, ?, ?, ?);`;
        var selectNewLectureSql = `SELECT id FROM lecture WHERE chapter_id = ? and priority = ?`;
        var videoInsertSql = `INSERT INTO lecture_video (lecture_id, video_id, play_time) VALUES (?, ?, ?);`;
        queryResult = await conn.query(lectureInsertSql, [body.chapterId, body.title, body.info, body.priority, body.type]);
        queryResult = await conn.query(selectNewLectureSql, [body.chapterId, body.priority]);
        var lectureId = queryResult[0].id;
        queryResult = await conn.query(videoInsertSql, [lectureId, body.videoId, body.playTime]);
      }
    } catch (err) {
      next(err);
      result.isSuccess = false;
      console.log(err);
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  },

  uploadPicture : async (body, fileLocationList) => {
    let selectSql = `SELECT id FROM lecture WHERE chapter_id = ? and priority = ?;`;
    var conn = null;
    var result = {isSuccess : true};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [body.chapterId, body.priority]) || null;
      var recordCount = queryResult.length;
      if (recordCount > 1) {
        result.isSuccess = false;
      } else {
        if (recordCount == 1) {
          let deleteSql = 'DELETE FROM lecture WHERE chapter_id = ? and priority = ?;';
          queryResult = await conn.query(deleteSql, [body.chapterId, body.priority]) || null;
        }       
        var lectureInsertSql = `INSERT INTO lecture (chapter_id, title, info, priority, type) VALUES (?, ?, ?, ?, ?);`;
        var selectNewLectureSql = `SELECT id FROM lecture WHERE chapter_id = ? and priority = ?`;
        var pictureInsertSql = `INSERT INTO lecture_picture (lecture_id, image_path, priority) VALUES (?, ?, ?);`;
        queryResult = await conn.query(lectureInsertSql, [body.chapterId, body.title, body.info, body.priority, body.type]);
        queryResult = await conn.query(selectNewLectureSql, [body.chapterId, body.priority]);
        var lectureId = queryResult[0].id;
        for (var index in fileLocationList) {
          queryResult = await conn.query(pictureInsertSql, [lectureId, fileLocationList[index], parseInt(index + 1)]);
        }
      }
    } catch (err) {
      next(err);
      result.isSuccess = false;
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  },

  getQuizLecture : async (chapterId) => {
    let selectSql = `SELECT id, title, priority FROM lecture WHERE chapter_id = ? and type = 0;`;
    var conn = null;
    var result = {quizLectureList: []};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [chapterId]) || null;
      for (var i in queryResult) {
        result.quizLectureList.push({id: queryResult[i].id, title: queryResult[i].title, priority: queryResult[i].priority});
      }
    } catch (err) {
      next(err);
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  },

  uploadQuiz : async (body) => {
    let selectSql = `SELECT id FROM lecture WHERE chapter_id = ? and priority = ?;`;
    var conn = null;
    var result = {isSuccess : true};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [body.chapterId, body.priority]) || null;
      var recordCount = queryResult.length;
      if (recordCount > 1) {
        result.isSuccess = false;
      } else {
        if (recordCount == 1) {
          let deleteSql = 'DELETE FROM lecture WHERE chapter_id = ? and priority = ?;';
          queryResult = await conn.query(deleteSql, [body.chapterId, body.priority]) || null;
        }       
        var lectureInsertSql = `INSERT INTO lecture (chapter_id, title, info, priority, type) VALUES (?, ?, ?, ?, ?);`;
        queryResult = await conn.query(lectureInsertSql, [body.chapterId, body.title, body.info, body.priority, body.type]);
      }
    } catch (err) {
      next(err);
      result.isSuccess = false;
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  },

  getQuestionList : async (lectureId) => {
    let selectSql = `SELECT id, title, priority FROM lecture_quiz WHERE lecture_id = ?`;
    var conn = null;
    var result = {questionList: []};
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [lectureId]) || null;
      for (var index in queryResult) {
        result.questionList.push({id: queryResult[index].id, title: queryResult[index].title, priority: queryResult[index].priority});
      }
    } catch (err) {
      next(err);
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  },

  uploadQuestion : async (body, fileLocation) => {
    let selectSql = `SELECT id FROM lecture_quiz WHERE lecture_id = ? and priority = ?;`;
    var choices = body.choices.split('@');
    var conn = null;
    var result = { isSuccess: true };
    try {
      conn = await pool.getConnection();
      var queryResult = await conn.query(selectSql, [body.lectureId, body.priority]);
      var recordCount = queryResult.length;
      if (recordCount >= 1) {
        let deleteSql = 'DELETE FROM lecture_quiz WHERE lecture_id = ? and priority = ?;';
        queryResult = await conn.query(deleteSql, [body.lectureId, body.priority]) || null;
      }
      let insertQuizSql = `INSERT INTO lecture_quiz (lecture_id, priority, title, explanation, image_path) VALUES (?, ?, ?, ?, ?);`;
      let selectQuizIdSql = `SELECT id FROM lecture_quiz WHERE lecture_id = ? and priority = ?;`;
      queryResult = await conn.query(insertQuizSql, [body.lectureId, body.priority, body.title, body.explanation, fileLocation]);
      queryResult = await conn.query(selectQuizIdSql, [body.lectureId, body.priority]);
      var quizId = queryResult[0].id;
      for (var index = 0; index < choices.length; index++) {
        let insertQuestionSql = `INSERT INTO quiz_question (quiz_id, content, answer_flag) VALUES (?, ? ,?);`;
        var answerFlag = 0;
        if (index + 1 == body.answerIndex) {
          answerFlag = 1;
        }
        queryResult = await conn.query(insertQuestionSql, [quizId, choices[index], answerFlag]);
      }
    } catch (err) {
      result.isSuccess = false;
      console.log(err);
      next(err);
    } finally {
      pool.releaseConnection(conn);
      return result;
    }
  }
}