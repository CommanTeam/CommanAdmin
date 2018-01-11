<template>
  <div>
    <label>강의 명</label>
    <input type='text' v-model="lectureTitle"/>
    <label>강의 설명</label>
    <input type='text' v-model="lectureInfo"/>
    <label>강의 순서</label>
    <input type="text" v-model="lecturePriority"/>
    <label>유튜브 비디오 id</label>
    <input type="text" v-model="lectureVideoId"/>
    <label>총 재생시간 (초단위) 예: 1분 12초 => 72초</label>
    <input type='text' v-model="lecturePlayTime"/>
    <button v-on:click="addLecture">등록하기</button>
  </div>
</template>
<script>

import axios from 'axios'
export default {

  data () {
    return {
      lectureTitle: null,
      lectureInfo: null,
      lectureType: 2,
      lecturePriority: 0,
      lectureVideoId: null,
      lecturePlayTime: 1
    }
  },
  props: ['chapterId'],
  methods: {
    addLecture () {
      if (this.lectureTitle == null ||
          this.lectureInfo == null ||
          this.lectureVideoId == null ||
          this.lecturePriority == null) {
        alert('정보를 제대로 입력하세요.')
        return
      }
      var body = {
        title: this.lectureTitle,
        info: this.lectureInfo,
        priority: this.lecturePriority,
        type: this.lectureType,
        videoId: this.lectureVideoId,
        chapterId: this.chapterId,
        playTime: (parseInt(this.lecturePlayTime) + 1) * 1000
      }
      axios.post(`course/chapter/lecture/video`, body)
        .then(x => {
          alert('강의 업데이트를 완료하였습니다.')
          this.$emit('refresh')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

