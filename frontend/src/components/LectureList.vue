<template>
  <div v-if="selectedChapter">
    <label>해당한 강좌의 단원 목록입니다.</label>
    <div v-for="lecture in lectureList"
         v-bind:key="lecture.id"
         class='list-elem'>
         <label>강의명: {{lecture.title}} </label>
         <label>설명: {{lecture.info}} </label>
         <label>강의 타입: {{lecture.typeString}} </label>
         <label>강의 순서: {{lecture.priority}} 번 째 </label>
    </div>
    <register-lecture v-bind:chapterId="selectedChapter.id"
                      v-on:refresh="refresh"></register-lecture>
    <button v-on:click="closeList">닫기</button>
  </div>
</template>

<<script>

import axios from 'axios'
import RegisterLecture from './RegisterLecture.vue'
export default {
  components: {
    RegisterLecture
  },
  created () {
    this.getLectureList()
  },
  data () {
    return {
      lectureList: [],
      isShowList: true
    }
  },
  methods: {
    getLectureList () {
      axios.get(`/course/chapter/lecture?id=${this.selectedChapter.id}`)
        .then((res) => {
          this.lectureList = res.data.lectureList
          var list = this.lectureList
          for (var idx in list) {
            let lecture = list[idx]
            if (lecture.lectureType === 0) {
              lecture.typeString = '퀴즈'
            } else if (lecture.lectureType === 1) {
              lecture.typeString = '카드 뉴스'
            } else {
              lecture.typeString = '영상'
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    closeList () {
      this.$emit('closeForm')
    },
    refresh () {
      this.getLectureList()
    }
  },
  props: ['selectedChapter'],
  watch: {
    selectedChapter (chapter) {
      this.getLectureList()
    }
  }
}
</script>
