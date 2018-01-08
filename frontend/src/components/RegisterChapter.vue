<template>
  <div>
    <div v-if="!showed">
      <h3> 단원을 업데이트 해주세요. </h3>
      <button v-on:click="showAndHide" >{{ showed? '접기' : '단원 추가하기'}}</button>
    </div>
    <div v-if="showed">
      <h3> 단원 업데이트 폼입니다. 단원 순서가 겹치게 되면 덮어씌웁니다. </h3>
      <form enctype="multipart/form-data">
        <label>단원 제목</label>
        <input type='text' v-model="chapterTitle"/>
        <label>단원 설명</label>
        <textarea v-model="chapterInfo"/>
        <label>단원 순서</label>
        <input type='text' v-model="chapterPriority"/>
        <input type='button' value='업데이트하기' v-on:click="updateChapter"/>
      </form>
      <button v-on:click="showAndHide" >{{ showed? '접기' : '단원 추가하기'}}</button>
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
  props: ['selectedCourse'],
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
    }
  }
}
</script>
