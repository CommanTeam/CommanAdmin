const express = require('express');
const router = express.Router();

const uploadServiceWithResize = require('../components/upload-service').uploadServiceWithResize;
const uploadService = require('../components/upload-service').uploadService;
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

router.post('/instructor', uploadServiceWithResize(640, 640, 'instructor_profile.png').single('instructorProfile'), 
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

router.post('/course/chapter/lecture/video', async (req, res, next) => {
  try {
    let result = await course.uploadVideo(req.body);
    if (result.isSuccess) {
      res.status(200).send(result);
    } else {
      res.status(500).send(result);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/course/chapter/lecture/picture', uploadService.array('quizPicture', 20), async (req, res, next) => {

  try {
    var fileLocationList = [];
    for (var idx in req.files) {
      fileLocationList.push(req.files[idx].location);
    }

    let result = await course.uploadPicture(req.body, fileLocationList)

    if (result.isSuccess) {
      res.status(200).send(result);
    } else {
      res.status(500).send(result);
    }

  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/course/chapter/lecture/quiz', async (req, res, next) => {
  try {
    var chapterId = req.query.chapterId;
    let result = await course.getQuizLecture(chapterId);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/course/chapter/lecture/quiz', async (req, res, next) => {
  try {
    var body = req.body;
    let result = await course.uploadQuiz(body);
    if (result.isSuccess) {
      res.status(200).send(result);
    } else {
      res.status(500).send(result);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.get('/course/chapter/lecture/quiz/question', async (req, res, next) => {
  try {
    var lectureId = req.query.lectureId;
    let result = await course.getQuestionList(lectureId);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/course/chapter/lecture/quiz/question', uploadService.single('questionPicture'), async (req, res, next) => {
  try {
    var fileLocation = null;
    if (req.file) {
      fileLocation = req.file.location;
    }
    let result = await course.uploadQuestion(req.body, fileLocation);
    if (result.isSuccess) {
      res.status(200).send(result);
    } else {
      res.status(500).send(result);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
