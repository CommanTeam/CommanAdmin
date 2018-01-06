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

router.get('/register_course', asyncMiddleware( async (req, res, next) => {
  let id = req.query.id;
  let result = await course.selectCourse(id);
  res.status(200).send(result);
}));

module.exports = router;
