<template>
  <div>
    <div v-if="!showed">
      <h3> 강의를 추가 해주세요. </h3>
      <button v-on:click="showAndHide" >강의 추가하기</button>
    </div>
    <div v-if="showed">
      <h3> 강의 추가 페이지 입니다. 강의의 타입을 선택해주세요. </h3>
      <ul>
        <li><router-link to="/course/lecture/video" v-on:refresh="refresh">비디오 강의</router-link></li>
        <li><router-link to="/course/lecture/picture" v-on:refresh="refresh">카드 뉴스</router-link></li>
        <li><router-link to="/course/lecture/quiz" v-on:refresh="refresh">퀴즈</router-link></li>
      </ul>
      <router-view v-bind:chapterId="chapterId"></router-view>
      <button v-on:click="showAndHide" >접기</button>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
export default {
  created () {
    this.$parent.$on('refresh', this.refresh)
  },
  data () {
    return {
      showed: false,
      chapterTitle: null,
      chapterInfo: null,
      chapterPriority: null
    }
  },
  props: ['chapterId'],
  methods: {
    showAndHide () {
      this.showed = !this.showed
    },
    updateChapter () {
      if (this.chapterTitle == null || this.chapterInfo == null || this.chapterPriority == null) {
        alert('정보를 모두 입력해주세요.')
        return
      }
      var body = {
        courseId: this.selectedCourse.id,
        title: this.chapterTitle,
        info: this.chapterInfo,
        priority: this.chapterPriority
      }
      axios.post(`course/chapter/register`, body)
        .then(x => {
          alert('단원 업데이트를 완료하였습니다.')
          this.$emit('updateChapter')
        })
        .catch(err => {
          console.log(err)
        })
    },
    refresh () {
      this.chapterTitle = null
      this.chapterInfo = null
      this.chapterPriority = null
      this.$emit('refresh')
    }
  }
}
</script>