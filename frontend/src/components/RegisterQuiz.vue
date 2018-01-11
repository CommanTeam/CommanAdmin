<template>
  <div>
    <label>퀴즈 강의 목록</label>
    <nav class="vertical-menu" v-if="quizLectureList.length > 0">
      <button v-on:click="selectLecture(lecture)" 
            v-for="lecture in quizLectureList" 
            v-bind:key="lecture.id">
            {{lecture.title}}
      </button>
    </nav>
    <div v-if="selectedLecture">
      <register-question v-bind:selectedLecture="selectedLecture"></register-question>
      <button v-on:click="foldQuestionComponent">접기</button>
    </div>
    <label>강의 추가하기</label>
    <label>강의 명</label>
    <input type='text' v-model="lectureTitle"/>
    <label>강의 설명</label>
    <input type='text' v-model="lectureInfo"/>
    <label>강의 순서</label>
    <input type='text' v-model="lecturePriority"/>
    <button v-on:click="updateLecture">퀴즈 업데이트 하기</button>
  </div>
</template>
<script>
import FileUpload from 'vue-upload-component'
import RegisterQuestion from './RegisterQuestion.vue'
import axios from 'axios'

export default {
  created () {
    this.getQuizLectures()
  },
  components: {
    FileUpload,
    RegisterQuestion
  },
  data () {
    return {
      lectureTitle: null,
      lectureInfo: null,
      lecturePriority: 1,
      lectureType: 0,
      quizLectureList: [],
      selectedLecture: null
    }
  },
  props: ['chapterId'],
  methods: {
    getQuizLectures () {
      axios.get(`course/chapter/lecture/quiz?chapterId=${this.chapterId}`)
        .then(x => {
          console.log(x.data)
          this.quizLectureList = x.data.quizLectureList
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectLecture (lecture) {
      this.selectedLecture = lecture
    },
    foldQuestionComponent () {
      this.selectedLecture = null
    },
    updateLecture () {
      var body = {
        title: this.lectureTitle,
        info: this.lectureInfo,
        priority: this.lecturePriority,
        type: this.lectureType,
        chapterId: this.chapterId
      }
      axios.post(`course/chapter/lecture/quiz`, body)
        .then(x => {
          alert('강의 업데이트를 완료하였습니다.')
          this.getQuizLectures()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

