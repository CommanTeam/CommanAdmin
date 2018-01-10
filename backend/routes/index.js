const express = require('express');
const router = express.Router();

const uploadServiceWithResize = require('../components/upload-service').uploadServiceWithResize;
const baseUrl = 'http://localhost:3000';
const asyncMiddleware = require('./utils/middleware');
const instructor = require('../components/instructor');
const course = require('../components/course')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

router.get('/instructors', asyncMiddleware( async (req, res, next) => {
  let result = await instructor.selectInstructorInfo();
  res.status(200).send(result);
}));

router.post('/register_instructor', uploadServiceWithResize(640, 640, 'instructor_profile.png').single('instructorProfile'), 
  asyncMiddleware(async (req, res, next) => {
    let name = req.body.name;
    let filePath = req.file.transforms[0].location;
    await instructor.insertInstructorInfo(name, filePath, next);
    res.sendStatus(200);
}));

router.get('/course', asyncMiddleware( async (req, res, next) => {
  let id = req.query.id;
  let result = await course.selectCourse(id);
  res.status(200).send(result);
}));

router.post('/course/register', uploadServiceWithResize(640, 640, 'course_thumnail.png').single('courseThumbnail'),
  asyncMiddleware(async (req, res, next) => {
    await course.insertCourse(req.body, req.file.transforms[0].location);
    res.sendStatus(200);
}));

router.get('/course/chapter', asyncMiddleware( async (req, res, next) => {
  let result = await course.selectChapter(req.query.id)
  res.status(200).send(result);
}));

router.post('/course/chapter/register', async (req, res, next) => {
  try {
    let result = await course.updateChapter(req.body);
    if (result.isSuccess) {
      res.status(200).send(result);
    } else {
      result.message = 'Database has duplicate records';
      res.status(500).send(result);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/course/chapter/lecture', async (req, res, next) => {
  try {
    let chapterId = req.query.id;
    let result = await course.selectLecture(chapterId);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
