<template>
  <div v-if="selectedCourse">
    <label>해당한 강좌의 단원 목록입니다.</label>
    <div v-for="chapter in chapterList"
         v-bind:key="chapter.id"
         class='list-elem'>
         <label>단원 명: {{chapter.title}} </label>
         <label>단원 설명: {{chapter.info}} </label>
         <label>단원 순서: {{chapter.priority}} </label>
         <button v-on:click="selectChapter(chapter)">단원 선택하기</button>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
export default {

  props: ['selectedCourse'],
  watch: {
    selectedCourse (course) {
      axios.get(`/course/chapter?id=${this.selectedCourse.id}`)
        .then((res) => {
          this.chapterList = res.data.chapterList
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  data () {
    return {
      chapterList: []
    }
  }
}
</script>